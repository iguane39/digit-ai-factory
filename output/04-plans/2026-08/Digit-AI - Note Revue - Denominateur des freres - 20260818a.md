# Digit-AI — Note de revue : le dénominateur des « frères » — 20260818a

> **À lire AVANT la revue du 2026-08-24** (étude `20260817-etude-opportunite-sequencement-factory.md`,
> plan `Digit-AI - Plan Renommage - Fenetre A factory - 20260817a.md`). Cette note **corrige un
> critère de revue** ; elle ne modifie aucun livrable daté.

Objet : TF-0358, point (2). Émise le 2026-08-18 par le pilot, sur mandat humain
(boucle d'amélioration des 17 restants).

## Le constat

L'étude de séquencement et l'étude de renommage écrivent toutes deux **« 14 »** pour désigner
la liste `FORGES` de `bootstrap.mjs` :

| Endroit | Ce qui est écrit | Ce qui est vrai |
|---|---|---|
| `20260817-etude-opportunite-sequencement-factory.md` l.107 | « liste `FORGES` l.19-45 = **14 entrées** » | **13 entrées** |
| idem l.239 | « liste `FORGES` l.19-45, **14 entrées** » | **13 entrées** |
| `20260817-etude-opportunite-renommage-factory.md` l.67 | « la liste `FORGES` (l.19-45) énumère les **14 frères** » | elle en énumère **13** |

Mesure du 2026-08-18, dérivée de la source et non recopiée :

```
node -e "const t=require('fs').readFileSync('bootstrap.mjs','utf8');
         const b=t.slice(t.indexOf('const FORGES = ['), t.indexOf('];', t.indexOf('const FORGES = [')));
         console.log((b.match(/\{ nom:/g)||[]).length)"
→ 13
```

## Pourquoi les deux comptes existent, et lequel s'applique à quel critère

Ils ne sont pas en conflit : **ils ne comptent pas la même chose**, et c'est l'étiquette qui
est fausse, pas les faits qu'elle porte.

| Compte | Valeur | Ce qu'il désigne |
|---|---|---|
| entrées de `FORGES` (bootstrap) | **13** | les dépôts que `node bootstrap.mjs --pull` clone et prouve |
| dépôts frères sur disque | **14** | les 13 ci-dessus **+ `digit-ai-forge-audit_client-a`**, espace d'engagement client, privé et **hors bootstrap** (déclaré tel quel `bootstrap.mjs` l.28-30) |

L'énumération de l'étude elle-même (l.47) est **juste** : elle liste 13 dépôts, somme
**48 occurrences**, et note explicitement que `digit-ai-forge-audit_client-a` en porte 0. Seule
l'étiquette « 14 » est erronée.

## Ce que la revue du 24/08 doit vérifier — critère (3) corrigé

> **Critère (3), tel qu'il doit être joué** : « même relevé `git grep -I -o -w forge-pilot`
> chez chacun des **13** dépôts de la liste `FORGES` de `bootstrap.mjs` → 0 hors
> justifications, et le mandat de campagne journalisé. **Plus** `digit-ai-forge-audit_client-a`,
> hors bootstrap, dont le relevé attendu est **0 occurrence** — s'il en porte, c'est un fait
> nouveau, pas un reste de la fenêtre C. »

Le compte de **48 occurrences** reste inchangé et se solde dépôt par dépôt selon l'énumération
de l'étude l.47 (agents 2 · agents-security 5 · audit 2 · conception 2 · data 2 · design 2 ·
development 2 · observability 2 · ops 2 · organization 16 · seo 2 · tests 3 · websec 6 = 48).

**Le dénominateur n'est pas un détail de rédaction** : un critère qui dit « 14 » et qu'on
vérifie sur 13 dépôts se déclare *tenu* sur un compte qui ne l'est pas, et le quatorzième —
`audit_client-a`, justement celui qui n'est pas cloné par le bootstrap — n'est jamais regardé.
C'est la famille de défauts que TF-0332 vient de solder.

## Pourquoi cette note plutôt qu'une correction dans l'étude

Les deux études sont des **livrables datés** (R-4) : les corriger après coup réécrirait
l'histoire d'une mesure prise le 17/08 et rendrait leur sceau menteur. La correction se porte
donc **à la revue** — c'est-à-dire ici, dans un livrable daté du jour, que le plan de revue
lit avant de jouer ses six critères.

## État des deux autres points de TF-0358

| Point | État au 2026-08-18 |
|---|---|
| (1) dossier local `c:\dev\digit-ai-forge-pilot` → `digit-ai-factory` | **fait** — vérifié : `c:\dev\digit-ai-factory` existe, aucun `digit-ai-forge-pilot` sur disque (seuls subsistent `digit-ai-forge-pilot_old` et `digit-ai-forge-pilot_vide`, hors périmètre) |
| (3) `README` de `digit-ai-forge-websec` l.5, sous-chemin `output/` → `output/03-etudes/` | traité dans le dépôt websec, même mandat |
