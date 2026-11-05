#!/usr/bin/env node
/**
 * hook-restitution-frictions.test.mjs — recette des FRICTIONS du tour (TF-2141, décision humaine D-172 (b) du 04/11/2026, RT-43 de Produit-84).
 *
 * Le hook de fin de tour relève les frictions du tour sur la TRANSCRIPTION (une correction du porteur, un refus de hook, un échec d'oracle),
 * les journalise dans `frictions.jsonl`, et juge chez un produit la ligne « Remontée à la factory » sur ce fait. Chaque règle est prouvée à
 * double sens, sur des transcriptions ÉPHÉMÈRES écrites dans le dossier temporaire (jamais dans l'arbre suivi) :
 *   · le relevé : une correction humaine relevée, une question neutre et ce qui n'est pas un message humain non relevés, un refus de hook
 *     avant outil et un retour bloquant du hook Stop relevés une fois chacun, un échec d'oracle relevé, une commande qui ne lance pas
 *     d'oracle ou un verdict imbriqué non relevés, un échec résolu dans le tour marqué ;
 *   · le contrôle : « rien à remonter » après une friction retenue refusé chez un produit, accepté avec un retour au ledger daté du tour ou
 *     consigné par commande (le remède joué), un retour antérieur qui ne couvre pas, SANS_OBJET au pilot et hors produit ;
 *   · le journal : écrit au pilot et chez un produit, sans doublon d'un passage à l'autre, une écriture ratée qui ne bloque pas ;
 *   · de bout en bout, par le hook de fin de tour et par `--prejuger`, avertissant, et bloquant quand `FORGE_FRICTIONS_BLOQUANTE=1`.
 * Joué par oracles/self-tests.mjs (I2).
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { releveFrictions, correctionHumaine, commandeLanceOracle, echecDOracle, journaliserFrictions, cheminFrictions, controlerFrictions,
  tourDesFrictions, declareRienARemonter, declareResteAuProduit, declareRienDeNeuf, motifDeResteAuProduit, retourNommeNonEcrit, RAPPEL_FRICTIONS } from "./lib-frictions.mjs";
import { analyserTranscript } from "./hook-restitution.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
const HOOK = join(ICI, "hook-restitution.mjs");
const base = mkdtempSync(join(tmpdir(), "hook-frictions-"));
const echecs = [];
let cas = 0;
const verifier = (condition, message) => { cas++; if (!condition) echecs.push(message); };
delete process.env.CLAUDE_PROJECT_DIR;   // TF-1943 : posée aux hooks par Claude Code, elle ne fuit pas dans la recette
const ENV_SANS_SESSION = { ...process.env };
delete ENV_SANS_SESSION.CLAUDE_CODE_SESSION_ID;
delete ENV_SANS_SESSION.FORGE_FRICTIONS_BLOQUANTE;
// Chez un produit, la restitution témoin pose D-1 : la RÉSERVATION est repoussée (comme au cas 64 de hook-restitution.test.mjs), seul FRICTIONS est en jeu.
const ENV_PRODUIT = { ...ENV_SANS_SESSION, FORGE_RESERVATION_BLOQUANTE_DES: "2099-01-01" };

// La restitution témoin de hook-restitution.test.mjs (BON), conforme pour oracle-synthese, plus la ligne de remontée de S48.
const BON = `La mise à jour demandée est en place et vérifiée : le poste repart sur les dernières versions des forges, et rien ne bloque la suite de votre journée. Ce que cela change : les prochaines sessions démarrent à jour sans geste de votre part. Ce qui est attendu de vous : une seule décision, ci-dessous, sur le moment de la publication.

## 1. En-tête
- quoi : campagne de mise à jour · sur quoi : la factory · quand : 2026-08-20 21:40 (Europe/Paris), durée 35 min · qui : pilot v1.17.19 · intention : que le poste reparte à jour sans geste de votre part, pas seulement que la recette passe. Test rétro : bootstrap et recette sont verts, l'intention est servie.

## 2. Verdict
- Recette du pilot 22/22 verte, bootstrap 7/7.

## 3. Décisions attendues
- **D-1 —** Publier maintenant la version corrigée du démarrage, ou attendre demain matin ? Le contrôle
  de \`bootstrap.mjs\` vient de passer en entier, donc la version est prête ; la seule question est
  de savoir si on la met à disposition des autres postes tout de suite, ou si on garde une nuit
  pour un dernier regard humain avant qu'elle ne circule.
  - (a) pousser maintenant — coût nul, exclut un dernier regard humain ; recommandé : le journal \`recette.md\` ne porte aucun défaut ouvert.
  - (b) pousser demain matin — coût : un poste périmé une nuit ; exclut la mise à disposition immédiate.
  - si rien n'est décidé : (a) s'applique.

## 4. Traité
- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.

## 5. Non traité
- la propagation sur les postes qui ne relancent jamais bootstrap — motif : hors de portée de ce correctif, couvert par la garde d'ouverture.

## 6. Écarts à la lettre
- aucun écart.

## 7. Risques
- un poste hors ligne ne vérifie pas sa fraîcheur — signal : avertissement « origin injoignable » au rapport ; parade : le défaut est dit, jamais masqué.

## 9. Traces
- \`bootstrap.test.mjs\` : la recette du démarrage, rejouée.

## 8. Prochaines actions
- **A-1** — auto_ia : TF-0001 rejouer la recette au prochain démarrage (d'abord, parce que gratuit).
  - motif de non-exécution : dependance_bloc_3 — attend la décision ci-dessus.
  - si rien n'est fait : la recette reste jouée sur l'état d'avant, donc son vert ne prouve rien.
- **A-2** — manuelle_utilisateur : TF-0002 décider (a)/(b) ci-dessus (ensuite, parce que tout le reste en dépend).
  - pourquoi pas l'IA : decision — arbitrage humain, R-29.
  - où : répondre \`(a)\` ou \`(b)\` au bloc 3 de ce message.
  - si rien n'est fait : le poste reste sur la version d'hier et toutes les suites attendent.
- manuelle_dev : aucune.
`;
const RIEN = BON + "\n- Remontée à la factory : rien à remonter.\n";
const LOT = BON + "\n- Remontée à la factory : lot « Produit - RETOURS - 20261104a » remis.\n";

// Les pièces d'une transcription.
const CORRECTION = "Pourquoi ce sujet n'est pas remonté à la Factory ?";
const humain = (texte, ts = "2026-11-04T09:24:00.000Z", extra = { origin: { kind: "human" } }) => ({ type: "user", timestamp: ts, ...extra, message: { role: "user", content: texte } });
const final = (texte, ts = "2026-11-04T09:30:00.000Z") => ({ type: "assistant", timestamp: ts, message: { role: "assistant", content: [{ type: "text", text: texte }] } });
let nOutil = 0;
const outil = (name, input, resultat, { erreur = false, ts = "2026-11-04T09:25:00.000Z" } = {}) => {
  const id = `toolu_fr_${++nOutil}`;
  return [{ type: "assistant", timestamp: ts, message: { role: "assistant", content: [{ type: "tool_use", id, name, input }] } },
    { type: "user", timestamp: ts, message: { role: "user", content: [{ type: "tool_result", tool_use_id: id, content: resultat, ...(erreur ? { is_error: true } : {}) }] } }];
};
const refusAvantOutil = () => outil("Bash", { command: "git stash -q" },
  "PreToolUse:Bash hook error: [node \"${CLAUDE_PROJECT_DIR}/forge/hooks/factory.mjs\" remisage]: REMISAGE REFUSÉ (TF-1754) — `git stash -q` remise SANS étiquette", { erreur: true });
const blocageStop = (ts = "2026-11-04T09:28:00.000Z") => [
  { type: "attachment", timestamp: ts, attachment: { type: "hook_blocking_error", hookName: "Stop", hookEvent: "Stop", blockingError: { blockingError: "[hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale : S1 — bloc(s) absent(s)" } } },
  { type: "user", timestamp: ts, isMeta: true, message: { role: "user", content: [{ type: "text", text: "Stop hook feedback: [hook restitution — R-44] oracle-synthese FAIL BLOQUANT sur ta réponse finale : S1 — bloc(s) absent(s)" }] } }];
const jsonl = (entrees) => entrees.map((e) => JSON.stringify(e)).join("\n") + "\n";

// Un produit (un `forge/retours/`), un faux pilot (`bootstrap.mjs` et `oracles/hook-restitution.mjs`, un `.git` pour la racine), un dossier quelconque.
let nDossier = 0;
const produit = ({ ledger = null } = {}) => {
  const d = join(base, `produit-${++nDossier}`);
  mkdirSync(join(d, "forge", "retours"), { recursive: true });
  if (ledger) writeFileSync(join(d, "forge", "ledger.jsonl"), jsonl(ledger), "utf8");
  return d;
};
const fauxPilot = () => {
  const d = join(base, `pilot-${++nDossier}`);
  mkdirSync(join(d, "oracles"), { recursive: true }); mkdirSync(join(d, ".git"), { recursive: true });
  writeFileSync(join(d, "bootstrap.mjs"), "// faux pilot de la recette\n", "utf8");
  writeFileSync(join(d, "oracles", "hook-restitution.mjs"), "// faux pilot de la recette\n", "utf8");
  return d;
};
const lireJournal = (chemin) => (existsSync(chemin) ? readFileSync(chemin, "utf8").split(/\r?\n/).filter(Boolean).map((l) => JSON.parse(l)) : []);
const hook = (dossier, entrees, { session = "t-fr", actif = false, env = ENV_PRODUIT } = {}) => {
  const p = join(base, `tour-${++nDossier}.jsonl`); writeFileSync(p, jsonl(entrees), "utf8");
  const r = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: dossier, env, input: JSON.stringify({ session_id: session, transcript_path: p, stop_hook_active: actif, cwd: dossier }) });
  let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { o = { brut: r.stdout, erreur: r.stderr }; }
  return { o, p, code: r.status };
};
const aFrictions = (o) => /FRICTIONS — /.test(JSON.stringify(o || {}));

try {
  // ---- LE RELEVÉ ---------------------------------------------------------------------------------------------------------------------
  // 1 — ROUGE : la correction du porteur, cas fondateur de RT-43, est relevée sur le message humain du tour, avec son extrait.
  {
    const f = releveFrictions([humain(CORRECTION), final(RIEN)]);
    verifier(f.length === 1 && f[0].type === "correction_humaine" && /pas remonté à la Factory/.test(f[0].extrait) && f[0].extrait.length <= 200 && f[0].ts === "2026-11-04T09:24:00.000Z",
      `1 : « ${CORRECTION} » → attendu une friction correction_humaine datée du message, obtenu ${JSON.stringify(f)}`);
  }
  // 2 — ROUGE : les autres formes du vocabulaire fermé, bornées à l'agent (deuxième personne, rappel, négation hors première personne).
  {
    const vues = ["Pourquoi tu n'as pas réutilisé le serveur que j'ai reconnecté ?", "Non, ce n'est pas ce que j'ai demandé.", "J'ai déjà demandé des textes courts.",
      "Encore une fois, les listes doivent être en puces.", "C'est faux, le seuil est 90 %.", "Tu as oublié la section 3.", "Le rapport ne respecte toujours pas le format attendu, pourquoi ?",
      "Ces textes ne permettent pas de décider. Recommence.", "Le prompt ne va pas, corrige."];
    const manquees = vues.filter((t) => !correctionHumaine(t));
    verifier(!manquees.length, `2 : formes de correction attendues comme relevées, manquées : ${JSON.stringify(manquees)}`);
  }
  // 3 — VERT : une question neutre n'est pas une correction (sur un tiers, à la première personne, une relance seule, une citation d'un tiers).
  {
    const neutres = ["Pourquoi ce format est-il le défaut ?", "Pourquoi je ne peux pas développer directement sur le Cloud ?", "recommence",
      "est-ce que ça ne va pas trop loin ?", "Voici son retour : « Non, ce n'est pas ce qu'on avait convenu » — qu'en penses-tu ?", "fais la mise à jour", "OK, fais la modif et recommence"];
    const accusees = neutres.filter((t) => correctionHumaine(t));
    verifier(!accusees.length, `3 : questions neutres attendues comme non relevées, accusées : ${JSON.stringify(accusees)}`);
  }
  // 4 — VERT : ce qui n'est pas un message humain ne se lit pas comme une correction — notification de tâche, message d'une autre session,
  // résumé de compaction, résultat d'outil.
  {
    const f = releveFrictions([
      humain("<task-notification><task-id>a1</task-id><summary>Pourquoi tu n'as pas fini ?</summary></task-notification>", "2026-11-04T09:00:00.000Z", { origin: { kind: "task-notification" } }),
      humain("Pourquoi tu n'as pas répondu ? (message d'une autre session)", "2026-11-04T09:01:00.000Z", { isMeta: true, origin: { kind: "peer" } }),
      humain("This session is being continued from a previous conversation. The porteur said: ce n'est toujours pas fait.", "2026-11-04T09:02:00.000Z", {}),
      ...outil("Bash", { command: "cat notes.txt" }, "Non, ce n'est pas ce que j'ai demandé : toujours pas"),
    ]);
    verifier(!f.length, `4 : notification, autre session, compaction et résultat d'outil ne sont pas des corrections humaines, obtenu ${JSON.stringify(f)}`);
  }
  // 5 — ROUGE : le refus d'un hook avant outil est relevé, avec l'outil et le message du hook.
  {
    const f = releveFrictions([humain("range le dépôt"), ...refusAvantOutil(), final(RIEN)]);
    verifier(f.length === 1 && f[0].type === "refus_hook" && f[0].outil === "Bash" && /^REMISAGE REFUSÉ/.test(f[0].extrait),
      `5 : un résultat « PreToolUse:Bash hook error: … » → attendu refus_hook (Bash) au message du hook, obtenu ${JSON.stringify(f)}`);
  }
  // 6 — ROUGE et VERT : le retour bloquant du hook Stop est relevé UNE fois (pièce jointe et message « Stop hook feedback » ne comptent pas
  // double) ; sans pièce jointe, le message suffit.
  {
    const deux = releveFrictions([humain("range le dépôt"), final("trop court"), ...blocageStop(), final(RIEN)]);
    const seul = releveFrictions([humain("range le dépôt"), final("trop court"), blocageStop()[1], final(RIEN)]);
    verifier(deux.length === 1 && deux[0].type === "refus_hook" && deux[0].outil === "Stop" && /S1 — bloc/.test(deux[0].extrait)
      && seul.length === 1 && seul[0].type === "refus_hook" && seul[0].outil === "Stop",
      `6 : blocage du hook Stop → attendu un seul refus_hook (Stop), pièce jointe ou message, obtenu ${JSON.stringify({ deux, seul })}`);
  }
  // 7 — ROUGE : l'échec d'un oracle ou d'un test lancé est relevé, par son verdict de tête ou par son code de sortie.
  {
    const f = releveFrictions([humain("juge la synthèse"),
      ...outil("Bash", { command: "node oracles/oracle-synthese.mjs output/x.md" }, "{\"outil\":\"oracle-synthese\",\"verdict\":\"FAIL\",\"findings\":[]}"),
      ...outil("PowerShell", { command: "cd C:/dev/p; node oracles/hook-restitution.test.mjs 2>&1 | Select-Object -Last 3" }, "Exit code 1\nhook-restitution : FAIL\n  - cas 3", { erreur: true })]);
    verifier(f.length === 2 && f.every((x) => x.type === "oracle_fail") && /oracle-synthese\.mjs → verdict FAIL/.test(f[0].extrait) && /exit 1/.test(f[1].extrait) && f[1].outil === "PowerShell",
      `7 : oracle FAIL et recette en exit 1 → attendu deux oracle_fail, obtenu ${JSON.stringify(f)}`);
  }
  // 8 — VERT : ce qui ne lance pas d'oracle, ou ne le montre pas en échec, n'est pas relevé (lecture, programme en ligne, verdict imbriqué,
  // verdict en clair de tête, non jugeable).
  {
    const f = releveFrictions([humain("cherche"),
      ...outil("Bash", { command: "grep -n S48 oracles/oracle-synthese.mjs" }, "Exit code 1", { erreur: true }),
      ...outil("Bash", { command: "node -e \"import('./oracles/lib-frictions.mjs')\"" }, "Exit code 1\nErreur", { erreur: true }),
      ...outil("Bash", { command: "node oracles/oracle-x.mjs --self-test" }, "{\"self_test\":\"PASS\",\"cas\":[{\"nom\":\"rouge\",\"verdict\":\"FAIL\"}]}"),
      ...outil("Bash", { command: "node C:/dev/digit-ai-forge-design/oracles/run-oracles-design.mjs page.html" }, "Verdict : PASS\n{\n \"oracle\": \"slop\",\n \"verdict\": \"FAIL\"\n}"),
      ...outil("Bash", { command: "node oracles/oracle-y.mjs f" }, "Exit code 2\n{\"verdict\":\"SKIP\"}", { erreur: true })]);
    verifier(!f.length, `8 : lecture, programme en ligne, cas rouge imbriqué, « Verdict : PASS » de tête et SKIP → attendu aucune friction, obtenu ${JSON.stringify(f)}`);
    verifier(commandeLanceOracle("cd /c/dev/x && node --test tests/a.test.mjs | tail -3") === "tests/a.test.mjs" && commandeLanceOracle("sed -n '1,9p' oracles/x.mjs") === null
      && echecDOracle("Exit code 1\nFAIL") !== null && echecDOracle("{\"verdict\":\"PASS\"}") === null,
      "8 bis : commandeLanceOracle et echecDOracle, cas élémentaires");
  }
  // 9 — Un échec qu'une réussite du même script suit dans le tour est marqué résolu ; sans réussite, il ne l'est pas.
  {
    const f = releveFrictions([humain("juge"),
      ...outil("Bash", { command: "node oracles/oracle-synthese.mjs a.md" }, "{\"verdict\":\"FAIL\"}"),
      ...outil("Bash", { command: "node C:/dev/p/oracles/oracle-synthese.mjs a.md" }, "{\"verdict\":\"PASS\"}"),
      ...outil("Bash", { command: "node oracles/oracle-ecriture.mjs a.md" }, "{\"verdict\":\"FAIL\"}")]);
    verifier(f.length === 2 && f[0].resolu === true && f[1].resolu === false, `9 : échec suivi d'un PASS du même oracle résolu, l'autre non, obtenu ${JSON.stringify(f)}`);
  }
  // 10 — Le tour des frictions commence au dernier message humain RÉEL : une notification de tâche ne sépare pas la correction de la
  // restitution qui la suit (le hook, lui, ouvre un segment à la notification).
  {
    const entrees = [humain("bonjour", "2026-11-04T08:00:00.000Z"), final("Bonjour.", "2026-11-04T08:00:05.000Z"), humain(CORRECTION),
      ...outil("Agent", { prompt: "x" }, "Async agent launched agentId: a9"),
      humain("<task-notification><task-id>a9</task-id><status>completed</status></task-notification>", "2026-11-04T09:29:00.000Z", { origin: { kind: "task-notification" } }),
      final(RIEN)];
    const t = tourDesFrictions(entrees);
    const a = analyserTranscript(jsonl(entrees));
    verifier(t.debut === 2 && t.depuis === "2026-11-04T09:24:00.000Z" && a.frictions.length === 1 && a.frictions[0].type === "correction_humaine" && a.depuisFrictions === "2026-11-04T09:24:00.000Z",
      `10 : la correction avant une notification reste dans le tour → attendu debut 2 et une correction, obtenu ${JSON.stringify({ t: { debut: t.debut, depuis: t.depuis }, f: a.frictions })}`);
  }

  // ---- LE CONTRÔLE -------------------------------------------------------------------------------------------------------------------
  const pC = produit();
  const fC = releveFrictions([humain(CORRECTION), final(RIEN)]);
  // 11 — ROUGE : chez un produit, une correction, « rien à remonter », aucun retour → FAIL, la friction citée (type et extrait), avertissant.
  {
    const c = controlerFrictions({ frictions: fC, texte: RIEN, racine: pC, retourConsigne: false });
    verifier(c.verdict === "FAIL" && c.bloquant === false && /correction_humaine : « Pourquoi ce sujet n'est pas remonté à la Factory \? »/.test(c.ecarts[0] || "") && /aucun retour n'est consigné/.test(c.ecarts[0] || ""),
      `11 : correction + « rien à remonter » + aucun retour → attendu FAIL avertissant citant la friction, obtenu ${JSON.stringify(c)}`);
  }
  // 12 — VERT : le retour consigné (le remède) rend PASS ; une ligne qui nomme le lot, ou qui garde le retour au produit avec son motif, aussi.
  {
    const r = controlerFrictions({ frictions: fC, texte: RIEN, racine: pC, retourConsigne: true });
    const lot = controlerFrictions({ frictions: fC, texte: LOT, racine: pC });
    // TF-2156 (05/11/2026) : « reste au produit, parce que… » ne passe plus SANS retour consigné — la doctrine de TF-1643 l'admettait, la mesure de TF-2141 a trouvé 4 passages
    // où il servait de porte de sortie à une friction sans retour. Avec le retour consigné (le remède joué), il passe ; le lot nommé passe comme avant.
    const LIGNE_RESTE = BON + "\n- Remontée à la factory : rien à remonter. La contradiction reste au produit, parce qu'elle vient de ma relecture.\n";
    const reste = controlerFrictions({ frictions: fC, texte: LIGNE_RESTE, racine: pC });
    const resteRemede = controlerFrictions({ frictions: fC, texte: LIGNE_RESTE, racine: pC, retourConsigne: true });
    verifier(r.verdict === "PASS" && lot.verdict === "PASS" && reste.verdict === "FAIL" && resteRemede.verdict === "PASS",
      `12 : retour consigné et lot nommé → PASS ; « reste au produit, parce qu'… » sans retour consigné → FAIL, avec retour consigné → PASS (TF-2156), obtenu ${JSON.stringify([r.verdict, lot.verdict, reste.verdict, resteRemede.verdict])}`);
    verifier(declareRienARemonter("Remontée à la factory : rien à remonter dans ce tour.") && !declareRienARemonter("Remontée à la factory : lot « P - RETOURS - 20261104a » remis, rien à remonter de plus."),
      "12 bis : declareRienARemonter lit la forme de S48 et écarte un lot nommé");
  }
  // 12 ter — TF-2156 : les deux formes qui passaient par la même porte. ROUGE : « reste au produit, parce que le retour sera consigné avec A-2 » (le cas du 04/11) et « rien de neuf à
  // remonter dans ce tour » après une friction, sans retour consigné → FAIL avertissant, la forme dite. VERT : les mêmes lignes avec le retour consigné (le remède), le lot nommé, et
  // « rien de neuf » sans friction (SANS_OBJET). Les prédicats de forme à double sens : le lot nommé n'est ni « reste au produit » ni « rien de neuf ».
  {
    const LIGNE_AVENIR = BON + "\n- Remontée à la factory : reste au produit, parce que le retour sera consigné avec A-2.\n";
    const LIGNE_NEUF = BON + "\n- Remontée à la factory : rien de neuf à remonter dans ce tour.\n";
    const a = controlerFrictions({ frictions: fC, texte: LIGNE_AVENIR, racine: pC });
    const n = controlerFrictions({ frictions: fC, texte: LIGNE_NEUF, racine: pC });
    verifier(a.verdict === "FAIL" && a.bloquant === false && a.forme === "reste au produit" && /garde le retour au produit/.test(a.ecarts[0] || "") && /correction_humaine : « Pourquoi ce sujet/.test(a.ecarts[0] || ""),
      `12 ter : friction + « reste au produit, parce que le retour sera consigné » sans retour → attendu FAIL avertissant, forme « reste au produit », la friction citée, obtenu ${JSON.stringify(a)}`);
    verifier(n.verdict === "FAIL" && n.bloquant === false && n.forme === "rien de neuf" && /rien de neuf/.test(n.ecarts[0] || ""),
      `12 quater : friction + « rien de neuf » sans retour → attendu FAIL avertissant, forme « rien de neuf », obtenu ${JSON.stringify(n)}`);
    const remedes = [LIGNE_AVENIR, LIGNE_NEUF].map((texte) => controlerFrictions({ frictions: fC, texte, racine: pC, retourConsigne: true }).verdict);
    const sansFriction = controlerFrictions({ frictions: [], texte: LIGNE_NEUF, racine: pC });
    verifier(remedes.every((v) => v === "PASS") && sansFriction.verdict === "SANS_OBJET",
      `12 quinquies : le retour consigné lève les deux formes ; « rien de neuf » sans friction est sans objet, obtenu ${JSON.stringify({ remedes, sans: sansFriction.verdict })}`);
    verifier(declareResteAuProduit("Remontée à la factory : reste au produit, parce que la note est locale.") && !declareResteAuProduit("Remontée à la factory : lot « P - RETOURS - 20261104a » remis ; le reste au produit, parce que la note est locale.")
      && !declareResteAuProduit("Remontée à la factory : rien à remonter.") && declareRienDeNeuf("Remontée à la factory : rien de neuf.")
      && !declareRienDeNeuf("Remontée à la factory : rien de neuf, rien à remonter.") && !declareRienDeNeuf("Remontée à la factory : rien de neuf ; reste au produit, parce que la note est locale.")
      && !declareRienDeNeuf("Remontée à la factory : lot « P - RETOURS - 20261104a » remis, rien de neuf de plus."),
      "12 sexies : declareResteAuProduit et declareRienDeNeuf lisent la forme, écartent le lot nommé et ne se recouvrent pas");
  }
  // 12 septies — TF-2137 (S48) : le motif d'un « reste au produit » qui NOMME un retour le dit écrit ou ne passe pas. ROUGE : promis au futur (« sera consigné avec A-2 », le cas du 04/11),
  // « consigné au ledger » devant un ledger sans retour, « seq 2 » alors que l'entrée 2 n'est pas un retour. VERT : le retour écrit (le remède, entrée seq 2 de type retour), écrit puis remis
  // plus tard (« sera remonté dans le lot de clôture »), un motif qui ne nomme aucun retour, « allers-retours » qui n'en est pas un.
  {
    const dit = (motif, seqs = []) => retourNommeNonEcrit(motifDeResteAuProduit(`Remontée à la factory : reste au produit, parce que ${motif}`), seqs);
    const futur = dit("le retour sera consigné avec A-2."), aVenir = dit("le retour est à consigner au prochain tour."), plusTard = dit("le retour sera écrit plus tard.");
    const sansEntree = dit("le retour est consigné au ledger."), seqAbsent = dit("le retour est consigné au ledger (seq 2).", [5]);
    const ecrit = dit("le retour est consigné au ledger (seq 2).", [2]), ecritPuisRemis = dit("le retour est consigné (seq 2) et sera remonté dans le lot de clôture.", [2]);
    const ecritSansSeq = dit("le retour est consigné au ledger.", [4]), sansRetour = dit("la note vient du produit, sans règle de la factory en cause."), allersRetours = dit("la page coûte des allers-retours au porteur.");
    verifier(futur.refus && aVenir.refus && plusTard.refus && sansEntree.refus && seqAbsent.refus,
      `12 septies : un retour promis au futur, ou dit écrit sans entrée correspondante → attendu refus, obtenu ${JSON.stringify({ futur, aVenir, plusTard, sansEntree, seqAbsent })}`);
    verifier(!ecrit.refus && ecrit.ecrit && !ecritPuisRemis.refus && !ecritSansSeq.refus && !sansRetour.refus && !sansRetour.nomme && !allersRetours.nomme,
      `12 octies : le retour écrit (seq présente), écrit puis remis plus tard, le motif sans retour, « allers-retours » → attendu aucun refus, obtenu ${JSON.stringify({ ecrit, ecritPuisRemis, ecritSansSeq, sansRetour, allersRetours })}`);
    verifier(motifDeResteAuProduit("Remontée à la factory : lot « P - RETOURS - 20261104a » remis.") === null && /sera consigné/.test(motifDeResteAuProduit("Remontée à la factory : reste au produit, parce que le retour sera consigné.") || ""),
      "12 nonies : motifDeResteAuProduit rend le motif d'une ligne « reste au produit », null sans elle");
  }
  // 13 — VERT : un refus du hook Stop (la forme de la restitution, déjà journalisée au pilot) et un échec d'oracle ne sont pas retenus ;
  // hors d'un produit, le contrôle se dit sans objet.
  {
    const nonRetenues = releveFrictions([humain("range"), ...outil("Bash", { command: "node oracles/oracle-synthese.mjs a.md" }, "{\"verdict\":\"FAIL\"}"), ...blocageStop(), final(RIEN)]);
    const c = controlerFrictions({ frictions: nonRetenues, texte: RIEN, racine: pC });
    const hors = controlerFrictions({ frictions: fC, texte: RIEN, racine: join(base, "nulle-part") });
    verifier(nonRetenues.length === 2 && c.verdict === "SANS_OBJET" && /aucune friction retenue/.test(c.motif) && hors.verdict === "SANS_OBJET" && /hors d'un produit/.test(hors.motif),
      `13 : refus du hook Stop et oracle FAIL non retenus, hors produit sans objet, obtenu ${JSON.stringify({ n: nonRetenues.length, c: c.motif, hors: hors.motif })}`);
  }

  // ---- LE JOURNAL --------------------------------------------------------------------------------------------------------------------
  // 14 — Le journal s'écrit chez un produit dans forge/frictions.jsonl, au pilot dans .claude/frictions.jsonl, ailleurs nulle part.
  {
    const pJ = produit(), piJ = fauxPilot(), ailleurs = join(base, "ailleurs"); mkdirSync(ailleurs, { recursive: true });
    verifier(cheminFrictions(pJ) === join(pJ, "forge", "frictions.jsonl") && cheminFrictions(piJ) === join(piJ, ".claude", "frictions.jsonl") && cheminFrictions(ailleurs) === null
      && journaliserFrictions({ racine: ailleurs, session: "s", frictions: fC }).chemin === null && !existsSync(join(ailleurs, ".claude")),
      "14 : chemins du journal — produit forge/frictions.jsonl, pilot .claude/frictions.jsonl, ailleurs aucun");
  }
  // 15 — Une ligne par friction, aux seuls champs de l'interface (ts, session, type, extrait ≤ 200, outil facultatif), sans doublon au second
  // passage de la même session ; une autre session écrit la sienne.
  {
    const pJ = produit();
    const f = releveFrictions([humain(CORRECTION + " " + "x".repeat(400)), ...refusAvantOutil(), final(RIEN)]);
    const un = journaliserFrictions({ racine: pJ, session: "s1", frictions: f });
    const deux = journaliserFrictions({ racine: pJ, session: "s1", frictions: f });
    const autre = journaliserFrictions({ racine: pJ, session: "s2", frictions: f.slice(0, 1) });
    const lignes = lireJournal(join(pJ, "forge", "frictions.jsonl"));
    const champs = lignes.every((l) => Object.keys(l).every((k) => ["ts", "session", "type", "extrait", "outil"].includes(k)) && l.extrait.length <= 200 && l.ts && l.session);
    verifier(un.ecrites === 2 && deux.ecrites === 0 && deux.deja === 2 && autre.ecrites === 1 && lignes.length === 3 && champs && lignes[1].outil === "Bash" && !("outil" in lignes[0]),
      `15 : journal — attendu 2 lignes puis aucun doublon, puis 1 pour l'autre session, aux champs de l'interface, obtenu ${JSON.stringify({ un, deux, autre, lignes })}`);
  }
  // 16 — ROUGE : une écriture impossible (le journal est un dossier) ne lève pas, elle se dit.
  {
    const pJ = produit(); mkdirSync(join(pJ, "forge", "frictions.jsonl"), { recursive: true });
    let r = null, leve = false;
    try { r = journaliserFrictions({ racine: pJ, session: "s", frictions: fC }); } catch { leve = true; }
    verifier(!leve && r && r.ecrites === 0 && Boolean(r.erreur), `16 : écriture ratée → attendu aucune exception et une erreur dite, obtenu ${JSON.stringify({ leve, r })}`);
  }

  // ---- DE BOUT EN BOUT, PAR LE HOOK DE FIN DE TOUR ----------------------------------------------------------------------------------
  // 17 — ROUGE : chez un produit, « rien à remonter » après la correction du porteur → avertissement FRICTIONS sous la réponse, sans refus,
  // le remède dit ; le journal du produit porte la friction.
  {
    const p = produit();
    const h = hook(p, [humain(CORRECTION), final(RIEN)], { session: "t-fr-17" });
    const lignes = lireJournal(join(p, "forge", "frictions.jsonl"));
    verifier(h.o?.decision !== "block" && /FRICTIONS — « - Remontée à la factory : rien à remonter\. » dans un tour qui porte 1 friction — correction_humaine : « Pourquoi ce sujet n'est pas remonté à la Factory \? »/.test(h.o?.systemMessage || "")
      && (h.o?.systemMessage || "").includes(RAPPEL_FRICTIONS.slice(0, 60)),
      `17 : correction + « rien à remonter » chez un produit → attendu l'avertissement FRICTIONS et son remède, sans refus, obtenu ${JSON.stringify(h.o).slice(0, 600)}`);
    verifier(lignes.length === 1 && lignes[0].type === "correction_humaine" && lignes[0].session === "t-fr-17" && lignes[0].ts === "2026-11-04T09:24:00.000Z",
      `17 bis : le journal du produit porte la correction, datée et rattachée à la session, obtenu ${JSON.stringify(lignes)}`);
    // 18 — Le second passage du même tour (réécriture après un refus) relit le tour et n'écrit pas la friction deux fois.
    const p2 = spawnSync(process.execPath, [HOOK], { encoding: "utf8", cwd: p, env: ENV_PRODUIT, input: JSON.stringify({ session_id: "t-fr-17", transcript_path: h.p, stop_hook_active: true, cwd: p }) });
    verifier(p2.status === 0 && lireJournal(join(p, "forge", "frictions.jsonl")).length === 1, `18 : second passage → attendu toujours 1 ligne au journal, obtenu ${lireJournal(join(p, "forge", "frictions.jsonl")).length}`);
  }
  // 19 — VERT, le remède joué : un retour consigné par commande dans le tour, ou une entrée `type: retour` du ledger datée après le message
  // humain, lèvent l'avertissement. ROUGE : un retour ANTÉRIEUR au message humain ne couvre pas le tour.
  {
    const parCommande = hook(produit(), [humain(CORRECTION), ...outil("Bash", { command: "python forge/ledger.py retour --resume \"sujet non remonté : la remontée se fait dans le tour\"" }, "seq 174 écrit"), final(RIEN)]);
    const parLedger = hook(produit({ ledger: [{ seq: 1, ts: "2026-11-04T09:26:00.000Z", type: "retour", resume: "sujet non remonté" }] }), [humain(CORRECTION), final(RIEN)]);
    const ancien = hook(produit({ ledger: [{ seq: 1, ts: "2026-11-03T09:26:00.000Z", type: "retour", resume: "autre sujet" }] }), [humain(CORRECTION), final(RIEN)]);
    verifier(!aFrictions(parCommande.o) && !aFrictions(parLedger.o) && aFrictions(ancien.o),
      `19 : remède par commande et par ledger → aucun FRICTIONS ; retour antérieur → FRICTIONS, obtenu ${JSON.stringify([aFrictions(parCommande.o), aFrictions(parLedger.o), aFrictions(ancien.o)])}`);
  }
  // 20 — VERT : la ligne qui nomme le lot remis ne reçoit aucun avertissement FRICTIONS.
  {
    const h = hook(produit(), [humain(CORRECTION), final(LOT)]);
    verifier(!aFrictions(h.o), `20 : lot nommé → attendu aucun FRICTIONS, obtenu ${JSON.stringify(h.o).slice(0, 300)}`);
  }
  // 20 bis — TF-2156 de bout en bout, par le hook de fin de tour : ROUGE « reste au produit, parce que le retour sera consigné avec A-2 » et « rien de neuf à remonter » après la correction
  // du porteur, sans retour → avertissement FRICTIONS ; VERT, le remède joué : le retour consigné par commande, ou une entrée `type: retour` du ledger datée après le message humain.
  {
    const AVENIR = BON + "\n- Remontée à la factory : reste au produit, parce que le retour sera consigné avec A-2.\n";
    const NEUF = BON + "\n- Remontée à la factory : rien de neuf à remonter dans ce tour.\n";
    const hAvenir = hook(produit(), [humain(CORRECTION), final(AVENIR)]);
    const hNeuf = hook(produit(), [humain(CORRECTION), final(NEUF)]);
    const remedeCommande = hook(produit(), [humain(CORRECTION), ...outil("Bash", { command: "python forge/ledger.py retour --resume \"sujet non remonté\"" }, "seq 174 écrit"), final(AVENIR)]);
    const remedeLedger = hook(produit({ ledger: [{ seq: 1, ts: "2026-11-04T09:26:00.000Z", type: "retour", resume: "sujet non remonté" }] }), [humain(CORRECTION), final(NEUF)]);
    verifier(aFrictions(hAvenir.o) && /reste au produit, parce que le retour sera consigné avec A-2/.test(JSON.stringify(hAvenir.o)) && hAvenir.o?.decision !== "block"
      && aFrictions(hNeuf.o) && /rien de neuf à remonter/.test(JSON.stringify(hNeuf.o)) && !aFrictions(remedeCommande.o) && !aFrictions(remedeLedger.o),
      `20 bis : « reste au produit » et « rien de neuf » après une correction, sans retour → FRICTIONS (sans refus) ; avec le retour consigné → aucun FRICTIONS, obtenu ${JSON.stringify([aFrictions(hAvenir.o), aFrictions(hNeuf.o), aFrictions(remedeCommande.o), aFrictions(remedeLedger.o)])}`);
  }
  // 21 — ROUGE : le refus d'un hook avant outil est une friction retenue ; VERT : le seul refus de forme par le hook Stop, puis la réécriture,
  // ne l'est pas, mais il est journalisé.
  {
    const avantOutil = hook(produit(), [humain("range le dépôt"), ...refusAvantOutil(), final(RIEN)]);
    const pS = produit();
    const stop = hook(pS, [humain("range le dépôt"), final("Fait."), ...blocageStop(), final(RIEN)], { session: "t-fr-21" });
    const lignes = lireJournal(join(pS, "forge", "frictions.jsonl"));
    verifier(aFrictions(avantOutil.o) && /refus_hook \(Bash\) : « REMISAGE REFUSÉ/.test(JSON.stringify(avantOutil.o)) && !aFrictions(stop.o) && lignes.length === 1 && lignes[0].outil === "Stop",
      `21 : refus avant outil → FRICTIONS ; refus du hook Stop seul → journalisé, non retenu, obtenu ${JSON.stringify({ a: aFrictions(avantOutil.o), s: aFrictions(stop.o), lignes })}`);
  }
  // 22 — VERT : au pilot, le contrôle est SANS_OBJET et seul le journal est écrit (.claude/frictions.jsonl du pilot).
  {
    const pi = fauxPilot();
    const h = hook(pi, [humain(CORRECTION), final(RIEN)], { session: "t-fr-22", env: ENV_SANS_SESSION });
    const lignes = lireJournal(join(pi, ".claude", "frictions.jsonl"));
    verifier(!aFrictions(h.o) && lignes.length === 1 && lignes[0].type === "correction_humaine" && lignes[0].session === "t-fr-22",
      `22 : au pilot → attendu aucun FRICTIONS et la friction au journal du pilot, obtenu ${JSON.stringify({ o: JSON.stringify(h.o).slice(0, 200), lignes })}`);
  }
  // 23 — ROUGE : une écriture ratée du journal ne bloque pas le hook, et le contrôle juge quand même.
  {
    const p = produit(); mkdirSync(join(p, "forge", "frictions.jsonl"), { recursive: true });
    const h = hook(p, [humain(CORRECTION), final(RIEN)]);
    verifier(h.code === 0 && h.o?.decision !== "block" && aFrictions(h.o), `23 : journal illisible → attendu exit 0, aucun refus, l'avertissement FRICTIONS, obtenu ${JSON.stringify({ code: h.code, o: JSON.stringify(h.o).slice(0, 300) })}`);
  }
  // 24 — ROUGE puis VERT, le chemin bloquant armé (`FORGE_FRICTIONS_BLOQUANTE=1`) : le hook refuse et dit FRICTIONS ; le remède joué
  // (le retour consigné par commande) passe sans refus.
  {
    const ENV_BLOQUANT = { ...ENV_PRODUIT, FORGE_FRICTIONS_BLOQUANTE: "1" };
    const rouge = hook(produit(), [humain(CORRECTION), final(RIEN)], { env: ENV_BLOQUANT });
    const remede = hook(produit(), [humain(CORRECTION), ...outil("Bash", { command: "python forge/ledger.py retour --resume \"sujet non remonté\"" }, "seq 174 écrit"), final(RIEN)], { env: ENV_BLOQUANT });
    verifier(rouge.o?.decision === "block" && /FRICTIONS — /.test(rouge.o?.reason || "") && remede.o?.decision !== "block" && !aFrictions(remede.o),
      `24 : bloquant armé → attendu un refus FRICTIONS, et le remède sans refus, obtenu ${JSON.stringify({ r: JSON.stringify(rouge.o).slice(0, 300), v: JSON.stringify(remede.o).slice(0, 200) })}`);
  }
  // 25 — `--prejuger` rend le même constat avant l'affichage : avertissement FRICTIONS, brouillon affichable ; armé bloquant, il refuse.
  {
    const p = produit();
    const t = join(base, "tour-prejuger.jsonl"); writeFileSync(t, jsonl([humain(CORRECTION), final("Je corrige.")]), "utf8");
    const b = join(base, "brouillon-frictions.md"); writeFileSync(b, RIEN, "utf8");
    const pj = (env, ...autres) => { const r = spawnSync(process.execPath, [HOOK, "--prejuger", b, "--transcript", t, ...autres], { encoding: "utf8", cwd: p, env }); let o = null; try { o = JSON.parse(r.stdout || "null"); } catch { /* illisible */ } return { code: r.status, o }; };
    const av = pj(ENV_PRODUIT), bl = pj({ ...ENV_PRODUIT, FORGE_FRICTIONS_BLOQUANTE: "1" });
    // TF-2171 (05/11/2026) : l'avertissement non motivé rend le préjugement non affichable (exit 1) ; motivé à l'appel, il l'est (exit 0).
    verifier(av.code === 1 && av.o?.affichable === false && (av.o?.avertissements || []).some((a) => /^FRICTIONS — .{20,}/.test(a)) && (av.o?.avertissements_sans_motif || []).includes("FRICTIONS") && av.o?.frictions?.verdict === "FAIL",
      `25 : --prejuger → attendu non affichable (exit 1) tant que l'avertissement FRICTIONS n'est pas motivé, dit avec son message, obtenu exit ${av.code} ${JSON.stringify(av.o).slice(0, 400)}`);
    // Le motif d'une règle ne couvre que cette règle : FRICTIONS motivée, le brouillon (qui porte aussi d'autres avertissements, ex. l'heure d'en-tête sans relevé) reste non affichable
    // tant que chacun n'est pas motivé ; tous motivés, il l'est.
    const motifs = (codes) => codes.flatMap((c) => ["--motif", `${c}=motif de la recette sur cette règle`]);
    const seul = pj(ENV_PRODUIT, ...motifs(["FRICTIONS"]));
    const tous = pj(ENV_PRODUIT, ...motifs(av.o?.avertissements_sans_motif || []));
    verifier(!(seul.o?.avertissements_sans_motif || []).includes("FRICTIONS") && (seul.o?.avertissements_motives || []).some((m) => m.code === "FRICTIONS")
      && (seul.o?.avertissements_sans_motif || []).length === (av.o?.avertissements_sans_motif || []).length - 1
      && tous.code === 0 && tous.o?.affichable === true && (tous.o?.avertissements_sans_motif || []).length === 0,
      `25 ter : le motif FRICTIONS ne couvre que FRICTIONS ; tous les avertissements motivés → affichable (exit 0), obtenu ${JSON.stringify({ seul: seul.o?.avertissements_sans_motif, tous: [tous.code, tous.o?.affichable, tous.o?.avertissements_sans_motif] })}`);
    verifier(bl.code === 1 && bl.o?.affichable === false && (bl.o?.bloquants || []).some((a) => /^FRICTIONS — /.test(a)),
      `25 bis : --prejuger armé bloquant → attendu exit 1 et le refus FRICTIONS, obtenu exit ${bl.code} ${JSON.stringify(bl.o?.bloquants || null).slice(0, 300)}`);
  }
  // 26 — Le tour survit à une notification de tâche, de bout en bout : la correction d'avant la notification est jugée.
  {
    const h = hook(produit(), [humain(CORRECTION), ...outil("Agent", { prompt: "x" }, "Async agent launched agentId: a9"),
      humain("<task-notification><task-id>a9</task-id><status>completed</status></task-notification>", "2026-11-04T09:29:00.000Z", { origin: { kind: "task-notification" } }), final(RIEN)]);
    verifier(aFrictions(h.o), `26 : correction, notification, puis « rien à remonter » → attendu FRICTIONS, obtenu ${JSON.stringify(h.o).slice(0, 300)}`);
  }
} catch (e) { echecs.push(`harnais : ${String(e && e.stack || e).slice(0, 400)}`); }
finally { try { rmSync(base, { recursive: true, force: true }); } catch { /* toléré */ } }

if (echecs.length) { console.error(`hook-restitution-frictions : FAIL (${echecs.length} sur ${cas})\n  - ` + echecs.join("\n  - ")); process.exit(1); }
console.log(`hook-restitution-frictions : ${cas}/${cas} PASS — LES FRICTIONS DU TOUR, À DOUBLE SENS (TF-2141, D-172 (b), RT-43, 04/11/2026) : la correction du porteur relevée et la question neutre épargnée, `
  + "notification, autre session, compaction et résultat d'outil jamais lus comme un message humain ; le refus d'un hook avant outil et le blocage du hook Stop relevés une fois ; "
  + "l'échec d'un oracle relevé, une lecture, un verdict imbriqué ou « Verdict : PASS » de tête non relevés, l'échec résolu marqué ; cas rouges : chez un produit, « rien à remonter » après "
  + "une correction ou un refus avant outil averti par le hook et par --prejuger, refusé quand le blocage est armé ; le remède joué (retour par commande ou au ledger daté du tour) passe, "
  + "un retour antérieur ne couvre pas, le lot nommé passe, le refus du hook Stop seul et l'échec d'oracle journalisés sans être retenus ; au pilot sans objet et journalisé ; "
  + "le journal écrit aux champs de l'interface, sans doublon au second passage, une écriture ratée sans blocage ; "
  + "TF-2156 (05/11/2026) : « reste au produit, parce que… » et « rien de neuf » après une friction, sans retour consigné, avertis comme « rien à remonter », le retour consigné ou le lot nommé les levant ; "
  + "TF-2137 : le motif d'un « reste au produit » qui nomme un retour promis au futur, ou dit écrit sans entrée au ledger, refusé, le retour écrit (seq présente) accepté ; "
  + "TF-2171 : --prejuger non affichable (exit 1) tant qu'un avertissement n'est pas motivé par --motif, affichable une fois chacun motivé");
