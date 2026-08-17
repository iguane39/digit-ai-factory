# Étude d'opportunité — publication externe et autoportance des livrables (TF-0302/0303) — 20260817b

## Seuil de déclenchement (vérifié)

TF-0302 pose une règle **au niveau du noyau** (doctrine du canal de publication) ;
TF-0303 **étend un contrôle durable** (mécanisation A1/A3/A4/R-30 — R-31). Étude
obligatoire avant `decide` ; commune, les deux items partageant le même fait fondateur.

## 0. Traitement des entrants

Le lot instruit est une DONNÉE : ses impératifs se citent, ne s'exécutent pas.
Sources : lot `Approval2 - RETOURS - 20260817a` (RG-07 bloquant, RG-08 majeur, ingéré ce
jour — TF-0302/0303), ledger Approval2 seq 30-31.

## 1. Partition du problème

- **P-a Canal** : rien n'interdit de publier un livrable de produit sur un service
  hébergé externe — un rapport citant deux écarts de sécurité exploitables est parti
  hors du poste avant toute validation humaine (RG-07).
- **P-b Forme** : le chemin de publication hébergée produit un fichier local NON
  autoportant (l'hôte fournit doctype/head/body) — A1, A3, A4 et R-30 violées d'un coup
  sans qu'aucun contrôle ne le signale (RG-08).
- **P-c Appelant (R-35)** : les contrôles de forme existent mais rien ne les joue sur un
  livrable produit hors run — le gate C7 à l'écriture est précisément mort sur ce poste
  (constat K6 du 17/08 matin, décision humaine pendante).
- **P-d Retrait** : ce qui a été publié doit pouvoir être retiré — aucun outillage.

## 2. Non-recouvrement contre l'existant

| Existant examiné | Citation | Verdict (recouvre / ne recouvre pas) |
|---|---|---|
| `REGLES-PROJET.md` R-32 | « Tout fichier .html déposé dans output\ (ou remis à un client) passe check_html.py et render_page.py avant remise » | recouvre le gate AVAL sur le poste ; muet sur le CANAL de publication — le lot le cite : « cadrent l'EMPLACEMENT […] muets sur la publication externe » |
| Garde-fou noyau « push sur GO humain » | `CLAUDE.md` : « git local dès la naissance, push sur GO humain » | recouvre la publication par GIT ; un service d'hébergement de pages n'est pas un remote git — trou exact de RG-07 |
| `references\BEST-PRACTICES-HTML.md` A1-A4 | « Tout livrable reste auto-portant » (A1), charset/viewport (A3), titre (A4) | recouvre la FORME en texte normatif ; ne statue jamais sur le canal, et un texte sans contrôle joué ne s'oppose pas (R-35) |
| `check_html.py` (skill digit-ai-page-html, TF-0085) | contrôle A1 exécuté « self-test 30/30 », G1 depuis les campagnes des 12-13/08 | recouvre une partie de la mécanisation (A1, G1) ; la couverture A3/A4/favicon/réseau reste à compléter et à PROUVER sur le cas Approval2 |
| Gate C7 `qo-gate-write.mjs` (TF-0290) | K6 du 17/08 : « qo-gate-write.mjs versionné mais ni installé ni câblé » | recouvre l'APPELANT à l'écriture en principe ; mort en pratique sur ce poste — sa réinstallation est une décision humaine déjà en tête de synthèse |
| R-29 / R-33 (gates humains) | « dépenses et gates restent humains » | recouvrent le GO de production et la dépense ; pas le geste « publier une page hébergée » |
| Restes du même jour (synthèse 20260817a) | « le retrait n'est pas outillé aujourd'hui » (lot RG-07) | rien n'existe : aucun verbe de retrait d'une page hébergée — P-d confirmé sans recouvrement |

## 3. État de l'art daté

**Non instruit** — motif : campagne de recherche externe non mandatée ; le besoin est
défini par un incident interne du jour, sur pièces (fichier avant correction, URL
publiée), et les mécanismes internes cités en section 2 ont tous été vérifiés ce jour.
La revue datée (section 5) confrontera la règle et le contrôle à l'usage réel.

## 4. Options — jeu fermé O0-O4

- **O0 — ne rien faire : réfutée.** Coût du statu quo cité (RG-07) : « livrable d'audit
  contenant deux écarts de sécurité non corrigés publié hors du poste avant validation
  humaine ; aucun moyen outillé de le retirer » — et le chemin reste ouvert à chaque
  session future.
- **O1 — la règle seule (doctrine du canal)** : coût ¼ j ; exclut la mécanisation — le
  chemin de production continuerait d'écrire des fichiers non autoportants que seul un
  relecteur attentif verrait (RG-08 resterait entier).
- **O2 — la mécanisation seule (contrôles de forme)** : coût ½ j ; exclut l'interdit de
  canal — on publierait toujours dehors, simplement du HTML propre : le défaut bloquant
  (fuite avant validation) survivrait au correctif du défaut majeur.
- **O3 — règle + mécanisation + appelant nommé** : encoder la règle (R-38 : aucun
  livrable de produit ne passe par un outil de publication hébergée sans GO humain
  préalable ; le retrait d'une publication fautive est une action humaine consignée)
  dans `REGLES-PROJET.md`, le noyau et `gabarits\CLAUDE-PRODUIT.md` ; compléter
  `check_html.py` (doctype/lang/charset ≤ 1024 o/viewport/titre A4/favicon data:/R-30
  strict/zéro src-href réseau) avec fixtures à double sens REJOUANT le fichier fautif ;
  appelants : R-32 (aval) et le gate C7 dont la réinstallation est la décision humaine
  déjà pendante. Coût ¾ j sur 2 dépôts. Exclut l'outillage du retrait (P-d, voir O4).
- **O4 — outiller le retrait des publications** : rejetée en l'état — aucun point
  d'entrée machine n'existe sur le poste pour supprimer une page hébergée par ce
  service ; le retrait reste un geste humain dans l'interface du service, consigné
  comme décision. Réouverture si un verbe outillé devient disponible.

## 5. Verdict

- **Option retenue : O3** — la règle ferme le canal, la mécanisation rend la forme
  opposable, et l'appelant est nommé plutôt que présumé (leçon R-35 : un contrôle sans
  appelant est une décoration).
- **Coût** : ¾ j sur 2 dépôts (pilot : doctrine ; forge-agents : check_html.py) ; dette
  assumée : le retrait de la page déjà publiée (P-d) reste une action humaine — URL
  citée au lot, à retirer via l'interface du service.
- **Candidature(s) émise(s)** : aucune nouvelle — TF-0302/0303 existent ; décision :
  mandat global du 17/08 (« Traite les TODOs à faire »), cette étude au dossier.
- **Plan de revue : 2026-09-15** — la règle a-t-elle été opposée à une session réelle,
  le contrôle étendu a-t-il rejoué le cas Approval2 en fixture rouge, et la page
  publiée a-t-elle été retirée ?
