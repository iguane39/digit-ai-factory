# Retours forges — Produit-62 — 20260907c

- **Contexte** : troisième retour humain de la journée sur le mandat forge-data `20260907-lineage-tenancy-schedule-asset` : « Aucun fichier HTML n'a été généré. Génère le fichier HTML de proposition de bout en bout, et remonte à la Factory que ce fichier n'a pas été généré alors qu'il doit faire partie intégrante de la proposition. »
- **Références ledger** : `forge\ledger.jsonl` seq 16 (retour humain), seq 17 (livrable HTML et journaux R-32), seq 18 (lot remis)
- **Remise au pilot** : copier ce fichier (et son sidecar) dans `<pilot>\input\00-retours\` — l'original reste ici.
- **Statut** : remis le 2026-09-07

Convention de gravité : **bloquant** · **majeur** · **mineur**. Portée : *générique* ou *produit+générique*.

## pilot (`digit-ai-factory`)

Le mandat a livré, en deux tours, un rapport Markdown, un mapping CSV, deux déclarations JSON jugées PASS, trois propositions exécutables (SQL, Markdown) et deux synthèses jugées PASS — et **aucune page HTML**. Le destinataire l'attendait comme partie intégrante de la proposition. La page a été produite après coup (`output\20260907c-proposition-lineage-tenancy-schedule-asset.html`, socle `digit-ai-page-html`, journaux R-32 sous `forge\oracles\`). Le fait à remonter n'est pas la page : c'est qu'aucune règle du run de mandat ne l'exigeait, et qu'aucun oracle ne l'a réclamée.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RF-3 | majeur | générique | **Le run de mandat ne fait du HTML qu'une option conditionnelle.** `references\RUN-MANDAT.md` : « Pas d'étape design ni de tokens — sauf si le livrable est une page HTML : alors le socle `digit-ai-page-html` s'applique en entier ». Le mandat choisit donc lui-même si le livrable EST une page HTML ; rien ne dit qu'une proposition remise à un humain EN COMPORTE une. Mesure : `grep -i html references\RUN-MANDAT.md` ne rend que la ligne du pas 2 (cadrage des oracles `check_html` / `render_page`) et la ligne « sauf si » ; `references\RUN-CONSEIL.md` ne mentionne pas le HTML. Le pas 5 « Clore » liste « livrable nommé R-4 dans `output\` » sans forme imposée. Retour humain mot pour mot : « Aucun fichier HTML n'a été généré […] il doit faire partie intégrante de la proposition ». | Règle qui aurait évité le retour : aucune règle existante ne le couvre — la surface implicite (loi transverse n° 3 : « proposée d'office et écartée explicitement, jamais par omission ») n'a pas d'instance « livrable HTML de proposition ». Proposer : (1) `RUN-MANDAT.md` pas 5 et `RUN-CONSEIL.md` C5 : **toute proposition ou trajectoire remise à un humain se remet AUSSI en page HTML autoportante** (socle `digit-ai-page-html`, R-32), sauf écart déclaré au ledger avec motif ; (2) `oracle-conformite-projet` (ou un oracle du domaine) : un `output\` de run de mandat qui porte un `.md` de rôle « proposition | étude | trajectoire » sans `.html` homonyme (même indice R-4) rend un constat ; (3) `gabarits\RESTITUTION.md` bloc 4 : la ligne « livrable HTML » figure dans le traité ou dans le non-traité avec motif (S36 le fait déjà pour la critique d'implémentation d'une page CITÉE — ici la page n'était pas citée, donc S36 ne pouvait rien voir). |
| RF-4 | mineur | générique | **Le boilerplate du socle contient la chaîne « <style> » dans un commentaire HTML avant la vraie balise** (S-G1 : « initialisation AVANT le <style> »). Un générateur qui extrait le bloc de style par la première occurrence de `<style>` embarque ce commentaire, l'init script et le titre dans son `<style>` : Chromium ne lit alors qu'UNE règle CSS (sélecteur « · »), la page perd tout son style, et le symptôme mesuré par `render_page.py` est un débordement de 2 106 px et un sommaire perdu — sans lien apparent avec la cause. `check_html.py` a en plus rendu un faux G1 (le commentaire cite `prefers-color-scheme`). Trois passes d'oracles ont été consommées avant de trouver que la feuille n'avait qu'une règle. | Piste : `check_html.py` — un contrôle « feuille de style parsable » : compter les règles CSS obtenues (via une lecture tolérante) et signaler une feuille qui en rend moins de N pour un `<style>` de plus de M octets ; ou, au boilerplate, écrire « balise de style » dans le commentaire S-G1 au lieu de la balise littérale (même famille de piège que RA-1 pour `</script`). |

## forge-agents (`digit-ai-forge-agents`, skill `digit-ai-page-html`)

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | mineur | générique | **`render_page.py` plante quand une capture échoue au lieu de le déclarer.** À 768 px et échelle 2, sur cette page de 188 Ko (≈ 13 500 px de haut), la capture pleine page a échoué ; `capture["faite"]` vaut faux, `data["png"]` vaut `None`, et la ligne 1641 (`Path(data['png']).name`) lève `TypeError: argument should be a str or an os.PathLike object … not 'NoneType'` : aucun verdict rendu pour cette largeur, exit 1, traceback dans le journal R-32. Le même appel en échelle 1 rend PASS. Reproduit deux fois (largeurs 1280,768,390 puis 768 seule). | Rendre l'échec de capture comme un constat (« capture non faite : <erreur> ») et poursuivre les autres largeurs ; ou retomber automatiquement en échelle 1 quand la hauteur × échelle dépasse la limite de Chromium, en le disant au rapport. |

## Remarques restées au produit

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Le mapping CSV comportait huit lignes mal délimitées (séparateur « ; » aussi présent dans le texte des cellules) | réécriture du CSV avec tous les champs entre guillemets, contrôle du nombre de champs par ligne | non | défaut d'écriture du produit ; le générateur HTML lit le CSV réparé |
| Le schéma de lineage en SVG rendait des chevauchements V4 (texte posé sur son rectangle de fond) et un débordement V1 | remplacé par une grille HTML de quatre colonnes reliées par des flèches textuelles, repliée en colonne sous 900 px | oui, candidat | le skill `digit-ai-schemas` porte peut-être déjà la forme ; non remonté faute d'avoir vérifié — à instruire par le pilot si récidive |
| Sommaire latéral rogné les tableaux à 1 280 px (page de données) | sommaire latéral seulement à partir de 1 400 px, bande collante de puces en dessous | non | choix de mise en page propre à une page de données à sept colonnes |

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot — la page suit le boilerplate du skill `digit-ai-page-html` (socle normatif), pas un gabarit de `gabarits\documents\`.

## Confirmations positives

- Les trois oracles du socle HTML ont tenu sur une page réelle de 188 Ko : `check_html.py` (36 règles) a fait poser légendes de badges (L3), descriptions de sommaire (L6), chapeaux courts (L7), exemples de lecture (L10), composant stylé (L21) ; `render_page.py` a mesuré au pixel les contrastes des badges (3,07:1 et 3,59:1), le sommaire perdu et les tableaux rognés ; `oracle-filtres-tableau.mjs` PASS dès la première passe grâce au composant `table-filters.js` inliné avec son CSS.
- La règle I1 (page de données pleine largeur) a forcé un vrai arbitrage de mise en page au lieu d'un « écart résiduel acceptable ».

## Ordre recommandé

1. RF-3 — parce qu'il a coûté un tour humain complet et qu'il vaut pour tout mandat ou conseil futur.
2. RA-1 — parce qu'un oracle qui plante ne rend aucun verdict, et qu'une page haute est le cas normal d'une proposition.
3. RF-4 — parce qu'il rend trois passes d'oracles illisibles quand il se produit, pour une cause d'une ligne.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

RF-3 suit un retour humain : aucune règle ne le couvre (RUN-MANDAT rend le HTML conditionnel au choix du mandat). Classe la plus proche : `surface-implicite-non-livree` (famille `affordance-ui`, « une page ou un état de la surface implicite qu'aucune demande de fonctionnalité ne fait naître ») — la page HTML de proposition est exactement une surface attendue d'office et non demandée. RA-1 ne suit pas un retour humain (panne d'outil mesurée par l'agent) ; classe la plus proche : `recette-verdict-non-prononcable` (famille `regle-morte`, « un verdict dépend d'un outil … ») — ici le verdict n'est pas prononçable parce que l'outil s'arrête. RF-4 ne suit pas un retour humain (défaut trouvé par l'agent) ; classe la plus proche : `regle-morte` n'a pas d'entrée adaptée, `gate-ecriture-juge-fichier-entier` non plus ; rattaché à `oracle-remplace-par-controle-maison` faute de mieux (le générateur a dû se doter de son propre diagnostic de feuille CSS), en laissant le pilot créer une classe « socle qui cite sa propre balise » s'il la juge utile.
