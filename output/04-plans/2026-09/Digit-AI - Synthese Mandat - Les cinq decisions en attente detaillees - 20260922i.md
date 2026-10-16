---
role: restitution de fin de tour, mandat transverse du 22/09/2026, neuvième tour
sources_de_verite: todo/TODO.jsonl · oracles/oracle-empreintes.mjs · oracles/oracle-repere-externe.mjs · oracles/oracle-run-reseau.mjs
verifie_le: 2026-09-22
---

# Digit-AI — Synthèse de mandat — Les 5 décisions en attente détaillées — 22/09/2026

## 0. Synthèse d'ouverture

Vous avez demandé le détail des décisions qui vous attendent. Elles sont 5, et non 3 : 2 d'entre
elles dorment depuis la veille dans un registre d'outillage, sans être jamais remontées à votre
écran. Chacune porte maintenant son fait mesuré, sa recommandation, ce que chaque issue coûte et
ce qu'elle exclut. Une correction est due au passage : j'ai écrit tout à l'heure qu'un contrôle
rendait 3 règles rouges avec un message précis ; rejoué à l'instant, il ne rend pas cela, il
s'arrête faute de dossier à lire. Le fait reste vrai — il manque bien 3 valeurs — mais la trace
que j'avais citée n'était pas celle que la commande produit. Aucune des 5 décisions n'est
urgente au sens où quelque chose casserait demain ; 2 débloquent un contrôle rouge, 2 libèrent
un outillage déjà construit et payé, et la cinquième ouvre un travail chez un produit.

## 1. En-tête d'identification

- **quoi** — instruction des décisions en attente : mesure de l'état réel de chacune, puis pose en
  décisions numérotées avec leurs issues fermées.
- **sur quoi** — le pilotage `digit-ai-factory`, le registre de repères porté par
  `digit-ai-forge-agents`, et le produit de communication `digit-ai-marketing`.
- **quand** — fin le 22/09/2026 à 20:01 (UTC+02:00), durée 1 h depuis la restitution précédente.
- **qui** — session du pilotage, `v1.17.30-702-gf8d7c2e`.
- **intention** — votre demande tient en 4 mots : détailler les décisions attendues. Elle vise à
  pouvoir trancher sans avoir à aller chercher les éléments. **Test rétro** : servie — chaque
  décision porte son fait mesuré ce soir, ses issues et leur coût. Elle a aussi fait apparaître
  2 décisions que mes restitutions taisaient, et une trace que j'avais citée à tort : les 2 sont
  au bloc 6.

## 2. Verdict en une ligne

5 décisions sont posées avec leurs issues fermées là où mes restitutions n'en énonçaient que 3 en
prose, 2 d'entre elles attendaient depuis le 21/09 sans jamais remonter, 1 trace que j'avais citée
est corrigée, et 0 ligne de code a été modifiée ce tour.

## 3. Décisions attendues de l'humain

Ce bloc porte 5 décisions, numérotées de D-33 à D-37. Les 3 premières lèvent chacune un blocage
nommé au tour précédent ; les 2 dernières dorment dans le registre de repères depuis le 21/09 et
n'avaient jamais été remontées. Pour répondre, un sélecteur suffit, et plusieurs tiennent dans un
seul message.

Les 3 bloquants qui restent, chacun énoncé sur place :

- **Le contrôle des repères externes rend rouge.** Il exige que les familles de livrables sans
  repère extérieur soient NOMMÉES, et aucune liste de ce genre n'existe aujourd'hui. Pour le
  lever, il faut me dire lesquelles n'en auront pas, et pourquoi. Si rien n'est fourni, une
  famille sans repère reste indiscernable d'un oubli.
- **Le contrôle des empreintes rend rouge sur le parc réel depuis le 17 septembre.** Un site de
  scellement est apparu chez le produit de communication sans rejoindre la table. Pour le lever,
  il faut dire s'il se déclare tel quel ou s'il rejoint d'abord la bibliothèque partagée. Si rien
  n'est fourni, le harnais garde un rouge permanent.
- **L'outillage de propale et de mémoire technique reste en pré-vol.** 2 repères sont instruits et
  testés mais restent en attente, donc servis à aucun consommateur. Pour les lever, il faut
  retenir une référence par cible. Si rien n'est fourni, 3 dépôts déjà construits restent
  inutilisables.

> **D-33 — Quelles familles de livrables du pilotage n'auront aucun repère extérieur ?**
>
> Le registre de repères porte 18 entrées, dont 14 servies. Le contrôle exige en plus une section
> qui NOMME ce que le registre ne couvre pas : sans elle, une famille sans repère se lit comme un
> oubli plutôt que comme un choix. Les familles que le pilotage produit et qui n'ont aujourd'hui
> aucune entrée sont au nombre de 5 : les synthèses de fin de tour, les revues et propositions de
> forge, les études d'opportunité, les plans et notes de migration, et les spécifications de
> produit.
>
> **Recommandation : (a).** Source consultée : `oracles/oracle-repere-externe.mjs`, dont la
> règle BR3 (un registre publie ce qu'il ne couvre pas) est la seule en défaut, et le registre
> `digit-ai-forge-agents/.claude/skills/la-barre/references/registre-barres.md`. Ces familles-là
> sont des documents de gouvernance interne : leur destinataire est ce poste, leur forme est déjà
> jugée par un contrôle maison, et aucun artefact public ne joue le même rôle.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) les 5 familles internes sont déclarées sans repère, avec leur motif écrit | effort simple × court | répondre « D-33 a » | exclut de leur chercher une barre plus tard sans rouvrir la section |
| (b) seules les synthèses et les notes sont déclarées sans repère ; les études gardent une barre à chercher | effort simple × moyen | répondre « D-33 b » | exclut de fermer le contrôle ce soir : la barre des études reste à instruire |
| (c) aucune famille n'est déclarée sans repère, et la section dit qu'elles sont toutes à instruire | effort simple × long | répondre « D-33 c » | exclut de servir les 14 repères actuels sans un chantier ouvert sur les 5 autres |

> **Si rien n'est décidé** : la section reste absente, le contrôle reste rouge, et une famille sans
> repère reste indiscernable d'un oubli.

> **D-34 — Le site de scellement apparu chez le produit de communication se déclare-t-il tel quel ?**
>
> Le fichier `scripts/generer-mesures.mjs` du produit `digit-ai-marketing` calcule
> un sceau (empreinte du contenu d'un fichier, posée pour détecter qu'il a changé) avec sa
> propre implémentation, sur les OCTETS BRUTS de son registre. C'est exactement le défaut
> corrigé ce jour dans le pilotage : un sceau ainsi calculé est vert sur le poste qui l'a posé et
> rouge partout ailleurs, parce que git réécrit les fins de ligne à chaque extraction. La table
> compte 5 mécanismes déclarés ; celui-ci serait le sixième, et il naîtrait avec un défaut déjà
> mesuré ailleurs.
>
> **Recommandation : (b).** Source consultée : `references/EMPREINTES.md` et la mesure du jour sur
> `scripts/verifier-jugement.mjs`, où un même fichier rendait `e7d248ac` sur le disque et
> `e7758dc3` au dépôt. Déclarer d'abord et corriger ensuite grave un défaut connu dans un
> référentiel ; corriger d'abord ne coûte qu'un run demandé au produit.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) le déclarer tel quel à la table, comme sixième mécanisme | effort simple × court | répondre « D-34 a » | exclut de le rendre portable sans une seconde décision, et grave un sceau (empreinte du contenu d'un fichier) non normalisé au référentiel |
| (b) ouvrir un run chez le produit pour lui faire consommer la bibliothèque partagée, puis déclarer | effort simple × moyen | répondre « D-34 b » | exclut de fermer le rouge ce soir : le run se tient chez le produit |
| (c) laisser le site hors table | nul | répondre « D-34 c » | exclut la fermeture du contrôle ; il restera rouge sur le parc |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — le contrôle garde son rouge, et un
> rouge que rien ne répare s'apprend à ignorer.

> **D-35 — Quelle référence retenez-vous comme repère d'une proposition commerciale ?**
>
> Le repère de la cible « propale privée » a été instruit le 14 septembre puis réexaminé le 21,
> au registre `la-barre` : sur 4 candidats, 1 seul survit.
> Une collection de propositions RÉELLES de cabinets de conseil, testée le 21/09 et joignable.
> Les 3 autres sont tombés et le registre le dit : l'un rend une erreur de service au script et un
> refus à la main, les 2 derniers sont des organisations professionnelles, pas des artefacts. Tant
> qu'aucune référence n'est retenue, l'entrée reste en attente et n'est servie à aucun des 3
> dépôts de propale déjà construits.
>
> **Recommandation : (a).** Source consultée : le registre de repères, entrée « propale privée »,
> et son test d'existence rejoué le 21/09 avec un code de réponse 200. Le niveau d'un livrable se
> mesure à un livrable, jamais à un guide d'écriture : c'est la raison pour laquelle les 2
> organisations ont été écartées comme barre et gardées comme source de méthode.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) retenir le survivant testé, et servir l'entrée aux 3 dépôts | nul | répondre « D-35 a » | exclut d'attendre une référence française, qui n'a pas été trouvée en 2 passages |
| (b) relancer une recherche de candidats avant de retenir | effort modéré × moyen | répondre « D-35 b » | exclut de servir l'entrée ce mois-ci ; les 2 passages précédents n'ont rien rendu de plus |
| (c) déclarer cette cible sans repère extérieur | effort simple × court | répondre « D-35 c » | exclut de mesurer le niveau d'une propale autrement que par nos propres contrôles de forme |

> **Si rien n'est décidé** : l'entrée reste en attente, et les 3 dépôts de propale restent sans
> barre à laquelle se comparer.

> **D-36 — Quelle référence retenez-vous comme repère d'un mémoire technique d'appel d'offres ?**
>
> Le repère de la cible « mémoire technique » a suivi la même instruction, le même jour, au même
> registre `la-barre` ; mais 3 candidats survivent, et ils ne disent pas la même chose : une
> collection publique de réponses réellement soumises avec leur issue, un cadre d'achat public
> britannique, et un guide français officiel qui décrit rubrique par rubrique ce qu'un acheteur
> attend. Le registre dit ses réserves : le guide français est une trame commentée de 2012 visant
> des travaux, et aucune réponse rédigée française ouverte n'a été trouvée en 2 passages, la
> confidentialité des offres l'expliquant.
>
> **Recommandation : (a).** Source consultée : le registre de repères, entrée « mémoire
> technique », dont le test d'existence a rendu 4 réponses 200 sur 4 le 21/09. Le registre propose
> lui-même 2 entrées de même cible, une par dimension : la réponse complète avec son issue, et
> l'attente d'un acheteur public français.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) retenir 2 entrées, une par dimension, comme le registre le propose | effort simple × court | répondre « D-36 a » | exclut d'avoir une barre unique : 2 entrées se tiennent à jour séparément |
| (b) ne retenir que la collection de réponses réellement soumises | nul | répondre « D-36 b » | exclut la dimension française : ce qu'un acheteur public d'ici attend ne serait plus mesuré |
| (c) ne retenir que le guide français officiel | nul | répondre « D-36 c » | exclut de se comparer à des réponses rédigées : une trame dit la forme, jamais le niveau |

> **Si rien n'est décidé** : l'entrée reste en attente, et un mémoire technique reste jugé sur sa
> seule forme.

> **D-37 — Ouvrez-vous le palier des publications chez le produit de communication ?**
>
> Le palier de publication du produit `digit-ai-marketing` attend 3 valeurs que vous seul
> détenez : la gouvernance des comptes, l'état de départ exporté depuis l'écran de statistiques du
> réseau, et le temps humain hebdomadaire en minutes. Le contrôle
> `oracles/oracle-run-reseau.mjs` ne peut pas encore les réclamer : rejoué ce soir, il rend
> « ignoré, dossier de semaine absent », parce que le dossier des publications du produit est vide
> et qu'aucun run n'y a été ouvert.
>
> **Recommandation : (b).** Source consultée : `oracles/oracle-run-reseau.mjs`, dont la sortie de
> ce soir est `{"verdict":"SKIP","motif":"dossier de semaine absent"}`, et l'étude du 17/09. Les 3
> valeurs sans le run ne seraient lues par rien ; le run sans les valeurs s'arrêterait au premier
> contrôle. Les 2 vont ensemble, et c'est le run qui les fait demander au bon moment.

| Option | Coût | Comment faire | Exclusions |
|---|---|---|---|
| (a) me donner les 3 valeurs maintenant, sans ouvrir le run | effort simple × court | répondre « D-37 a » puis me dicter les 3 valeurs | exclut leur vérification : aucun contrôle ne les lira tant que le run n'est pas ouvert |
| (b) ouvrir le run chez le produit, qui demandera les 3 valeurs à leur place | effort modéré × long | répondre « D-37 b » | exclut de traiter d'autres sujets pendant ce run : il se tient chez le produit, sur 4 semaines |
| (c) reporter le palier | nul | répondre « D-37 c » | exclut la mesure du premier cas réel, et repousse d'autant la revue déjà datée au 9 octobre |

> **Si rien n'est décidé** : l'option (c) s'applique de fait — le palier reste ouvert sans pouvoir
> publier, et la revue datée arrivera sans mesure à lire.

## 4. Traité — chaque point avec sa preuve exécutée

- **L'état réel de chaque décision a été mesuré, pas recopié.** Preuve : le contrôle des empreintes
  rend FAIL en nommant 1 site non déclaré, `generer-mesures.mjs` chez `digit-ai-marketing` ; le
  contrôle des repères rend FAIL sur sa seule règle BR3, avec 18 repères au registre dont 14
  servis ; le contrôle du palier rend SKIP avec le motif « dossier de semaine absent ».
- **2 décisions qui n'étaient jamais remontées à l'écran sont sorties du registre d'outillage
  (TF-1028).**
  Preuve : les entrées « propale privée » et « mémoire technique » portent toutes deux
  `statut: todo (pas 5 SOUMIS à l'humain le 21/09/2026 — décision humaine requise)`, et leur test
  d'existence a rendu 1 réponse 200 sur 1 et 4 sur 4 le 21/09.
- **La cause du site de scellement non déclaré est identifiée, pas supposée.** Preuve : le fichier
  en cause importe la fonction de hachage directement et l'applique aux octets bruts de son
  registre, sans normalisation — la ligne est lisible dans `scripts/generer-mesures.mjs` du
  produit. C'est la même classe que le défaut corrigé ce jour dans le pilotage.
- **Une trace que j'avais citée dans la restitution précédente est corrigée.** Preuve : le contrôle
  du palier rend `{"oracle":"oracle-run-reseau","verdict":"SKIP","motif":"dossier de semaine
  absent"}`, et non les 3 règles rouges avec le message que j'avais écrit.

## 5. Non traité — chaque point avec son motif

- Les 5 décisions elles-mêmes : motif `decision` — les poser est mon travail, les trancher est le
  vôtre.
- La section de non-couverture du registre de repères : motif `dependance_bloc_3` — elle attend
  D-33, et le contrôle exige une liste qu'une machine ne peut pas composer.
- Le passage du produit de communication à la bibliothèque partagée : motif `garde_fou` — le
  pilotage n'écrit pas chez un produit sans run demandé.
- Les 3 dossiers décidés et laissés ouverts au tour précédent : motif `garde_fou` — inchangés, et
  leurs raisons tiennent toujours.

## 6. Écarts à la lettre

- Vous avez demandé le détail des décisions attendues. J'en ai détaillé 5 là où mes restitutions
  n'en énonçaient que 3. Pourquoi : 2 décisions instruites le 21/09 attendaient dans un registre
  d'outillage sans jamais remonter à votre écran, et les taire en détaillant les autres aurait été
  le contraire de ce qui m'était demandé.
- J'ai corrigé une trace que j'avais écrite il y a une heure. Vous n'avez rien demandé de tel :
  j'avais attribué au contrôle du palier un message qu'il ne rend pas, et une trace fausse dans une
  restitution jugée verte est plus coûteuse qu'une absence de trace.
- Le livrable ne contient rien d'autre que ce périmètre : aucune décision tranchée à votre place,
  aucun fichier de code modifié, aucun contrôle touché.

## 7. Risques

- **Une trace citée peut être fausse alors que le fait qu'elle appuie est vrai.** Le palier attend
  bien 3 valeurs, mais le message que j'avais cité n'est pas celui que la commande produit.
  - signal : une trace recopiée d'une restitution à la suivante sans être rejouée.
  - parade : les 4 contrôles cités ce soir ont été rejoués avant d'être écrits, et leur sortie est
    reproduite telle quelle.
- **Une décision instruite mais rangée dans un référentiel n'est pas une décision posée.** 2 barres
  attendaient depuis le 21/09 dans un fichier que vous n'ouvrez pas.
  - signal : un référentiel qui porte `décision humaine requise` sans qu'aucune restitution ne
    reprenne la ligne.
  - parade : elles sont au bloc 3 ce soir ; la parade durable serait un contrôle qui relève ces
    mentions et refuse une restitution qui les tait, et il n'existe pas.
- **Déclarer un mécanisme défectueux dans un référentiel le grave.** Le sixième site de scellement
  porte le défaut corrigé aujourd'hui dans le pilotage.
  - signal : une entrée de table ajoutée pour éteindre un rouge plutôt que pour décrire un état
    voulu.
  - parade : la recommandation de D-34 inverse l'ordre, corriger puis déclarer, et son coût est
    nommé.

## 8. Prochaines actions

| Sél. | Action | Acteur | Id | Motif | Si rien n'est fait |
|---|---|---|---|---|---|
| **A-56** | Écrire la section de non-couverture du registre de repères selon la liste retenue, puis rejouer `node oracles/oracle-repere-externe.mjs` | `auto_ia` | TF-1028 | `dependance_bloc_3` — attend D-33 | le contrôle reste rouge, et une famille sans repère reste indiscernable d'un oubli |
| **A-57** | Inscrire les références retenues aux 2 entrées en attente et passer leur statut à servi | `auto_ia` | TF-1028 | `dependance_bloc_3` — attend D-35 et D-36 | 3 dépôts déjà construits restent sans barre à laquelle se comparer |
| **A-58** | Traiter le site de scellement, l'endroit où un sceau (empreinte du contenu d'un fichier) est posé, selon la voie retenue : bibliothèque partagée puis déclaration, ou déclaration seule à `references/EMPREINTES.md` | `auto_ia` | TF-0980 | `dependance_bloc_3` — attend D-34 | le harnais garde un rouge permanent depuis le 17 septembre |
| **A-51** | Fusionner les 2 lignées du socle des pages, puis reprendre la forme qui doit déclarer un calque | `auto_ia` | TF-1307 | `garde_fou` — la publication attend un feu vert humain (règle 38) | les 2 lignées re-divergent chaque jour, et 2 dossiers décidés restent bloqués derrière |
| **A-52** | Écrire la règle qui exige de nommer le périmètre mesuré quand une preuve cite un verdict, éprouvée dans ses 2 sens : `node oracles/oracle-synthese.mjs <fixture>` | `auto_ia` | TF-1262 | `garde_fou` — l'oracle visé bloque la fin de chaque tour, la règle s'ouvre en début de run | un verdict vert continue de se lire comme une absence de limite |
| **A-53** | Publier les 3 forges corrigées après votre feu vert : `git push` depuis `digit-ai-forge-audit`, `digit-ai-forge-agents`, `digit-ai-forge-tests` | `auto_ia` | TF-1207 | `gate_gouvernance` — publier attend un feu vert humain (règle 38) | 3 corrections restent locales, et les postes qui consomment ces forges gardent le défaut |
| **A-59** | Trancher les 5 décisions — répondre « D-33 a » à « D-37 c », plusieurs par message | `manuelle_utilisateur` | TF-1028 | `decision` — chacune engage un niveau de qualité, un référentiel partagé ou un run chez un produit | 2 contrôles restent rouges et 3 dépôts déjà construits restent inutilisables |
| **A-54** | Publier le travail du pilotage : `git push origin main` | `manuelle_utilisateur` | TF-1312 | `decision` — publier engage ce que les autres postes recevront | le sceau (empreinte du contenu d'un livrable, posée une fois qu'il est relu) portable et les 8 corrections du tour précédent restent sur ce poste |

L'ordre suit l'effet de levier : `A-56`, `A-57` et `A-58` ne coûtent chacune que quelques minutes
une fois la décision prise, et ferment 2 rouges ; `A-51` et `A-52` sont les chantiers ouverts du
tour précédent, qui ne dépendent de personne d'autre que du temps.

## 9. Traces

- Livrable de ce tour : [Digit-AI - Synthese Mandat - Les cinq decisions en attente detaillees - 20260922i.md](output/04-plans/Digit-AI%20-%20Synthese%20Mandat%20-%20Les%20cinq%20decisions%20en%20attente%20detaillees%20-%2020260922i.md)
- Contrôle des empreintes : [oracle-empreintes.mjs](oracles/oracle-empreintes.mjs) — FAIL, 1 site
  non déclaré nommé.
- Contrôle des repères : [oracle-repere-externe.mjs](oracles/oracle-repere-externe.mjs) — FAIL sur
  la seule règle BR3, 18 repères au registre dont 14 servis.
- Contrôle du palier : [oracle-run-reseau.mjs](oracles/oracle-run-reseau.mjs) — SKIP, motif
  « dossier de semaine absent ».
- Registre : [TODO.jsonl](todo/TODO.jsonl) — contrôle du registre PASS, état inchangé depuis la
  restitution précédente.
- Remontée à la factory : sans objet — ce tour s'est joué au pilotage seul, en lecture.
