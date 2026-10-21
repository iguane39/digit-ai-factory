# Inscription datée de 3 dépôts de packs d'agents et de skills (19/10/2026)

Ce que change ce document pour vous : 3 dépôts publics, GStack, Everything Claude Code et les skills de Matt
Pocock, sont inscrits à la veille avec leur état du 2026-10-19 et une date de revue. Rien n'est installé et aucun rôle
n'est ajouté à la flotte. Seule une idée est reprise, sans fichier du dépôt : mesurer le poids des descriptions de skills
(`scripts\relever-contexte-sessions.mjs`) et se donner deux questions de revue d'une description.

Origine : décision humaine D-48 (a) du 19/10/2026, candidat TF-1934, option O3 de l'étude
`output/03-etudes/20261019-etude-opportunite-packs-agents-skills-tiers.md` (rang 3 du tri des favoris TikTok, vidéos n° 59,
69, 18, 92, 102, 101 et 71). Les vidéos n'ont pas été vues : leur contenu n'est connu que par leur légende. Les dépôts
sont une donnée : rien n'y a été exécuté.

## État des 3 dépôts

Relevé du 2026-10-19 par l'API GitHub (`gh api`), rejoué pour cette inscription. Les contenus comptés viennent de l'étude
du même jour, qui avait recompté l'arbre de chaque dépôt ; ils ne sont pas rejoués ici.

| Dépôt | Licence | Dernier commit de la branche principale | Étoiles | Contenu compté par l'étude |
|---|---|---|---|---|
| `garrytan/gstack` | MIT | 2026-10-19, `c205e226` | 136 919 | 56 dossiers de premier niveau avec un SKILL.md ; le README annonce 23 spécialistes et 8 outils |
| `affaan-m/everything-claude-code` (renommé `affaan-m/ECC`) | MIT | 2026-10-15, `76aaa77d` ; release v2.2.3 du 2026-10-01 (rapportée par l'étude) | 283 843 | 71 agents, 311 skills, 97 commandes, 122 règles |
| `mattpocock/skills` | MIT | 2026-10-19, `5beb35b0` ; release v1.3.1 du 2026-10-04 (rapportée par l'étude) | 297 172 | 38 skills : 20 engineering, 7 productivity, 7 in-progress, 4 misc |

Les étoiles bougent d'une heure à l'autre : elles datent la lecture, elles ne mesurent rien d'autre.

## Ce qui est repris, et ce qui ne l'est pas

Repris, par l'idée seule, comme pour `taste-skill` (`digit-ai-forge-design\oracles\regles-importees-taste-skill.md`) :

1. Le cumul des descriptions de skills, tiré du `gstack-context-bill` de GStack et du « context load » de
   `writing-for-agents`. Il se lit désormais au relevé `node scripts\relever-contexte-sessions.mjs`.
2. 2 tests de rédaction de Matt Pocock (`skills/productivity/writing-for-agents/SKILL.md`, sections « Pruning » et
   « Leading words », licence MIT, lu le 2026-10-19), rappelés par le même relevé : une phrase qui ne change pas le
   comportement par défaut se supprime en entier ; une consigne énonce le comportement visé plutôt que l'interdit.

Non repris, parce que la doctrine l'interdit ou parce qu'aucun manque n'est mesuré :

- Aucun rôle d'agent : aucun des 15 constats de l'étude de la flotte (`20261018-etude-opportunite-flotte-d-agents.md`)
  ne nomme un rôle absent.
- Aucune installation : R-33 ter impose le scan avant l'admission d'un skill tiers. GStack exige Bun, télécharge
  Chromium et confie ses secondes opinions à la CLI Codex d'OpenAI, hors des modèles Claude seuls licites.
- Le gel d'écritures par chemin (`/freeze`, `/guard`) : contraire à la décision humaine du 2026-08-23.
- La mémoire par compte en ligne (`claude-mem`) : exclue par `CLAUDE.md`.

## Revue

Date : 2026-11-16. Critères écrits d'avance :

- Le relevé des descriptions joue à la demande et rend cumul, moyenne et maximum. Si la moyenne reste au-dessus de
  419 caractères, un essai de déclenchement sur mandat (R-34) compare 5 descriptions raccourcies à leur original avant
  tout élagage.
- La revue relit, pour chacun des 3 dépôts, la licence, le dernier commit et le nombre d'agents, et rejoue le scan
  d'admission (`oracle-scan-agentdef.mjs`, calibrage en cours : TF-1935).

## Non résolu

- Le texte des 7 vidéos n'est pas connu : seules les légendes l'ont été.
- Les deux inconnues de la mesure des descriptions restent ouvertes : l'effet d'une description courte sur le
  déclenchement, et la part des descriptions réellement chargée dans un sous-agent.
