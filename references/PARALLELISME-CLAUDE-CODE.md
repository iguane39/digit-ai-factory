---
role: les fonctions officielles de Claude Code qui font travailler plusieurs agents ou sessions à la fois, avec leur statut, leur limite, leur source et leur date de lecture, et la décision du pilot sur chacune
sources_de_verite: [output/03-etudes/20261019-etude-opportunite-sessions-paralleles-paliers-autonomie.md (étude 20261019f, section 3 « État de l'art daté » : pages de documentation de Claude Code lues le 2026-10-19), scripts/relever-flotte.mjs (indicateur de simultanéité, TF-1928), gabarits/AGENT-CAMPAGNE.md (contrat de campagne)]
verifie_le: 2026-10-19
revue_prevue: 2026-11-08
---

# Fonctions officielles de parallélisme de Claude Code

Ce que change ce document pour vous : la Factory sait désormais mesurer combien de sous-agents tournent
ensemble dans une session, et elle garde ici, datées, les fonctions officielles qui permettraient d'aller
plus loin. **Projects n'est pas adopté.** Une donnée de plateforme se périme sans avertir (loi transverse n° 4) :
chaque ligne porte sa date de lecture, et la revue est fixée au 2026-11-08.

Provenance : les pages de documentation ci-dessous ont été lues le 2026-10-19 par l'étude 20261019f,
non relues pour ce document. Une page de documentation n'a pas de date de publication : la date est celle de la lecture.

## Les fonctions

Le tableau donne, pour chaque fonction officielle, son statut, ses limites et la page où elles se lisent.

| Fonction | Statut au 2026-10-19 | Limites relevées | Source (page lue le 2026-10-19) |
|---|---|---|---|
| Sous-agents | disponible | 20 sous-agents simultanés par session, par défaut ; isolation `worktree` disponible dans la définition d'un agent | `https://code.claude.com/docs/en/sub-agents` |
| Vue des agents | aperçu | non chiffrée par l'étude | `https://code.claude.com/docs/en/agents` |
| Équipes d'agents | expérimental, désactivé par défaut | conseil de la documentation : 3 à 5 équipiers ; pas de reprise d'une session dont des équipiers sont en cours | `https://code.claude.com/docs/en/agent-teams` |
| Workflows dynamiques | disponible | jusqu'à 16 agents à la fois et 1 000 par exécution ; aucune question posée en cours de route ; les droits de la session s'appliquent | `https://code.claude.com/docs/en/workflows` |
| Sessions cloud | disponible | clonage et branches par GitHub ; limites de débit partagées avec tout l'usage de Claude ; depuis Windows natif, tout fichier suivi modifié part tel quel, `.env` compris | `https://code.claude.com/docs/en/claude-code-on-the-web` |
| Routines | aperçu de recherche | déclencheurs planifié, API ou GitHub ; exécution cloud sans demande d'accord, sur des branches `claude/` ; 100 exécutions planifiées par heure au plus | `https://code.claude.com/docs/en/routines` |
| Projects | bêta publique, plans Pro et Max (ni Team ni Enterprise) depuis le 2026-09-17 | absente du CLI, de VS Code et de JetBrains ; 200 nouveaux fils par jour au plus ; chaque fil est une session complète, le plus souvent cloud | `https://code.claude.com/docs/en/claude-projects` ; début de bêta : TBreak, 2026-09-18, source secondaire |

## Décision du pilot

**Projects : non adopté.** Décideur : l'humain, par sa réponse « 41a » du 19/10/2026 (D-48 (a)), consignée au registre
`todo\TODO.jsonl` sous TF-1928 (événement `maj`, statut `decide`, 2026-10-19), qui a retenu l'option O1 de l'étude. Trois obstacles se cumulent.
Projects manque au CLI et à VS Code, où la Factory travaille. Ses fils clonent des dépôts GitHub, alors que la
Factory lit l'état du poste : transcriptions, registre, skills installés. Et son nombre de fils n'est pas plafonné,
quand la Factory borne ses boucles à 5 cycles. Un fil local par Remote Control existe, mais exige Claude Code 2.1.280
ou plus et n'a pas été essayé.

Aucun essai de workflow, de routine ni de Projects n'est lancé. Les gates ne bougent pas : GO humain pour le push
du pilot et pour la production, G-2, 5 cycles au plus, dépenses humaines (`gabarits\AGENT-CAMPAGNE.md`,
`REGLES-PROJET.md` R-29 et R-38).

## Conditions de reprise

Un essai ne se décide que si les conditions écrites d'avance tiennent à la revue du 2026-11-08, ou plus tôt si
la documentation de Projects annonce son arrivée aux plans Team ou au CLI.

1. L'indicateur de pic se lit au relevé de flotte : `node scripts\relever-flotte.mjs --depuis <date>` écrit une ligne
   « simultanéité de sous-agents » (fait par TF-1928).
2. La part des appels vers un agent nommé a atteint 90 % (critère du relevé de flotte).
3. L'isolation par `worktree` est posée pour les agents qui écrivent dans un même dépôt.
4. Aucun commit croisé entre sessions n'est consigné sur la période (précédent : `3f47dcfc`, le 22/09/2026).

Si les conditions 1 à 4 tiennent, un essai de workflow dynamique en local se décide. Un essai de Projects sur une
forge se décide si le compte donne accès à la fonction.

## Mesure de départ

Relevé du 2026-10-19 par `node scripts\relever-flotte.mjs --depuis 2026-09-19` (version 1.2.0, 59 dossiers de projets) :
56 sessions ont lancé des sous-agents, 20 d'entre elles en ont eu 5 ou plus à la fois, 4 en ont eu 10 ou plus, et le pic
maximal est de 14, contre 20 permis par défaut. L'étude 20261019f avait mesuré le même pic de 14 par un script jetable.
La part des appels vers un agent nommé était de 18 % sur ce relevé, pour 90 % visés. L'unité est le sous-agent d'une
session, pas la session parallèle : le 22/09/2026, 15 sessions étaient vivantes sur le poste, dont 4 sur le pilot.

## Non vérifié

- L'échelle à quatre paliers de la vidéo n° 87 n'a aucune source officielle ; elle ne sert pas de critère.
- L'accès de votre compte à Projects, et le plan, ne se lisent pas depuis ce poste.
- Un `agent()` de workflow peut-il viser un agent nommé de `.claude\agents` : non vérifié.
- Le pic de simultanéité peut être surestimé : un sous-agent en attente compte comme actif.
