---
role: tri des favoris TikTok ajoutés entre le 02/11 et le 09/11/2026, avec la pertinence d'une étude d'opportunité pour chaque sujet Claude et IA
destinataire: humain
---

# Tri des sujets Claude et IA des favoris TikTok — 20261109a

Sur 48 favoris de la page du 09/11, 6 sont neufs ; 5 parlent de Claude ou d'IA et donnent 5 sujets. Aucun ne mérite une étude poussée. 2 se tranchent par un essai court : le skill `unslop` contre l'oracle des marqueurs de design générique de forge-design, et le principe d'attention du prototype de DeepSeek contre le relevé d'ouverture du pilot. 1 sujet est à écarter, Agent Reach, et 2 restent sans suite.

Demande d'origine : « Traite les favoris Tiktok : input\Tiktok\iguane39 (@iguane39) _ TikTok - 20261109.html ». Le filtre « Claude et IA » et la grille sont ceux du tri du 02/11 (`output/03-etudes/Digit-AI - Étude - Tri des sujets Claude et IA des favoris TikTok - 20261102e.md`), rejoués par le skill `tri-de-sujets`.

## Ce qui a été lu

La page porte 48 favoris, après dédoublonnage, et 7 liens hors liste, ceux du panneau de notifications, qui ne sont pas des sujets. 32 favoris étaient rangés le 02/11 et 10 autres le 19/10 ; une recherche indépendante des identifiants dans les 2 fichiers redonne ces chiffres. Restent 6 contenus neufs, lus ainsi :

- la légende de la page, pour les 6 ;
- l'image de couverture du dossier `_files`, pour les 6 ;
- la source primaire nommée ou retrouvée, pour 3 : les dépôts `heydamir/unslop`, `Panniantong/Agent-Reach` et `deepseek-ai/dsh-superagent-prototype`, lus le 09/11.

Rien n'a été téléchargé : les réponses 120b et 142b valaient pour le tri du 02/11. 1 contenu reste non qualifié : sa légende ne dit rien et sa couverture ne nomme qu'un dépôt sur 9. Le télécharger pour l'écouter est la décision D-182. Aucun contenu ne sort du filtre. Le détail des 6 reste dans `input/Tiktok/rangement-20261109.json`, ignoré par git.

## Le tableau

Les lignes vont du verdict le plus engageant au moins engageant. Les chiffres d'étoiles et de dates viennent de l'API GitHub, relevée le 09/11.

| Élément abordé | Vidéos | Pertinence d'une étude | Motif |
|---|---|---|---|
| Skill `unslop` : audit d'une interface qui « fait IA », puis reprise par passes (espacement, couleur, icônes, texte, typographie) | [@lemondedumarketing](https://www.tiktok.com/@lemondedumarketing/video/7704223496028622112) | Essai court | Profite à `digit-ai-forge-design`, dont `oracles/oracle-slop.mjs` couvre déjà 4 des 9 marqueurs : texte en dégradé (S2), dégradé violet vers bleu (S5), emojis et badges « New ✨ » (S6). Aucun existant trouvé sur ce dépôt (termes : unslop, heydamir). Licence CC BY 4.0, 12 419 étoiles, créé le 29/10/2026. La voie est celle de taste-skill : règles extraites avec attribution, rien d'installé (`output/03-etudes/2026-08/20260814-etude-opportunite-taste-skill.md`). |
| Prendre le moins d'attention humaine possible : principe du prototype `dsh-superagent` de DeepSeek, un routeur qui confie chaque demande à un agent de travail | [@thehypekevin](https://www.tiktok.com/@thehypekevin/video/7704338800524135698) | Essai court | Le prototype tourne sur le harnais de DeepSeek, pas sur Claude Code : rien à installer. Sa doctrine recoupe R-58 (décision posée seulement si son ressort est humain) et `output/03-etudes/20261019-etude-opportunite-sessions-paralleles-paliers-autonomie.md`. Fait neuf : son panneau ne montre que ce qui attend une personne, un état sain n'y prend aucune place. Licence MIT, publié le 31/10/2026, marqué « research prototype ». |
| Agent Reach (`Panniantong/Agent-Reach`) : un agent qui lit X, Reddit, Instagram, Facebook, LinkedIn et 9 autres plateformes | [@melvynx.dev](https://www.tiktok.com/@melvynx.dev/video/7705323818604170518) | À écarter | Le dépôt copie la session Chrome de l'utilisateur pour automatiser les plateformes à connexion, dont X, Reddit, Facebook, Instagram et LinkedIn. `references/PLATEFORMES-RESEAUX.md` (lignes 42 à 48) y tient l'automatisation hors interface pour interdite, soumise à autorisation ou encadrée. La transcription exige une clé Groq ou OpenAI, contraire à la règle « Aucune API tierce payante hors Claude » de `CLAUDE.md`. GitHub et le web se lisent déjà par `gh` et WebFetch. |
| 3 skills de design pour Claude : `emilkowalski/skills`, `pbakaus/impeccable`, `Leonxlnx/taste-skill` | [@unefille.ia](https://www.tiktok.com/@unefille.ia/video/7704623879007833377) | Sans suite | Déjà étudiés : `output/03-etudes/2026-08/20260814-etude-opportunite-taste-skill.md`, et `output/03-etudes/20261019-etude-opportunite-skills-design-tiers.md` pour `emilkowalski/skills` et impeccable. Le skill `impeccable` est installé. La légende n'apporte aucun fait neuf. |
| Ce que coûte une IA d'entreprise au-delà de l'API : RAG, agents MCP, sécurité, coût des jetons, observabilité | [@khrys0237](https://www.tiktok.com/@khrys0237/video/7704800939231808800) | Sans suite | Propos général, sans outil ni chiffre nommé. Chaque thème a déjà sa forge : `fiches/forge-agents-security.md`, `fiches/forge-observability.md`, `fiches/forge-data.md`. Aucun geste à reprendre. |

## Les 2 essais proposés

**unslop.** La description du skill nomme 9 marqueurs d'une interface générée. 5 manquent aux règles S1 à S10 d'`oracle-slop` au relevé du 09/11 : halos, formes brillantes, libellés en capitales espacées, éléments qui pulsent, espacement irrégulier. L'essai cherche lesquels se détectent sur un fichier statique, avec une fixture rouge et une verte. S'il en trouve au moins 2, ils entrent dans `oracle-slop` avec le crédit qu'exige la licence CC BY 4.0.

**Principe d'attention de DeepSeek.** Le prototype ne montre que ce qui attend une personne. L'essai compte, dans le relevé d'ouverture de `oracles/hook-ouverture.mjs`, les lignes qui disent un état sain, comme « à jour » ou « aucune revue due ». Au-delà d'un quart, le relevé ne garderait que ce qui attend un geste. Les chiffres de l'article de DeepSeek ne sont pas repris : le dépôt dit lui-même que certaines idées de l'article ne sont pas implémentées.

## Limite à garder en tête

La règle de verdict reste celle du 02/11, avec le score minimal de 14 : rejouée à l'aveugle sur 14 études, elle s'accorde 7 fois avec leur résultat réel. Un « Sans suite » veut dire « rien ne presse ».

Sources primaires consultées le 09/11/2026 : [unslop](https://github.com/heydamir/unslop), [Agent Reach](https://github.com/Panniantong/Agent-Reach), [dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype) et sa note `docs/000-philosophy.md`.
