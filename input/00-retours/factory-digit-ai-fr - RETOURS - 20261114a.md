# Retours forges — factory-digit-ai-fr — 20261114a

- **Contexte** : analyse L99 en mode boucle d'un prompt de refresh du site (14/11/2026). Un
  relecteur aveugle a relevé que `design/DESIGN.md` annonce des polices qui ne sont pas celles du
  site ; le recompte à la source en a trouvé la cause dans le générateur de forge-design.
- **Références ledger** : forge/ledger.jsonl seq 47.
- **Remise au pilot** : copié dans `digit-ai-factory\input\00-retours\` par `oracle-lot.mjs --remettre`.
- **Statut** : a_remettre

Convention de gravité : **bloquant** · **majeur** · **mineur**.

---

## Ce qui s'est passé

Le prompt réécrit de la passe 1 bornait le refresh du design par « polices Roboto et DM Sans
inchangées », valeurs lues dans `design/DESIGN.md`. Deux relecteurs aveugles ont montré que
`static/tokens.css` déclare Iowan Old Style, Georgia et system-ui. Le recompte a établi que
`DESIGN.md` est bien régénéré depuis `tokens.css` (empreinte `36bfd29e`, égale au sha256 actuel du
fichier) : l'écart ne vient pas d'un fichier périmé, mais du générateur, qui ne trouve pas les
polices et écrit une valeur de repli codée en dur.

---

## digit-ai-forge-design (`digit-ai-forge-design`)

Ce chapitre porte un seul retour, RD-1 : le générateur de la charte invente des polices quand il
ne trouve pas les siennes.

Le tableau se lit ligne par ligne : une ligne est un retour, avec sa gravité, sa portée, le fait
observé et sa preuve, puis la proposition.

| id | Gravité | Portée | Retour (fait observé, avec preuve) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | **majeur** | générique | **`generer-design-md.mjs` écrit des polices de repli quand il ne trouve pas les variables qu'il attend.** Preuve : `skills/systeme-de-marque/scripts/generer-design-md.mjs`, lignes 173-174, `police("police-titres") \|\| police("police-titre") \|\| "Roboto"` et `police("police-corps") \|\| police("police-texte") \|\| "DM Sans"` ; `static/tokens.css` du produit, lignes 52-56, nomme ses polices `--font-display` (Iowan Old Style) et `--font-body` (Georgia). Résultat : `design/DESIGN.md`, marqué « NE PAS ÉDITER », annonce Roboto et DM Sans, et un prompt de refresh a pris ces polices pour la charte. Régénérer le fichier reproduit l'écart. | Lire aussi `--font-display`, `--font-body` et `--font-meta` ; et, faute de police trouvée, refuser de générer en le disant plutôt qu'écrire un repli. Un fichier généré qui invente une valeur passe pour une source de vérité. |

## Remarques restées au produit

Aucune remarque n'est restée au produit : l'écart de polices de `DESIGN.md` n'a pas été corrigé
chez le produit (le fichier ne s'édite pas), il est remonté ci-dessus en RD-1.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de `gabarits\documents\` dans ce tour : rien à dire.

## Documents mûrs

Aucun document mûr.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé.
