# Synthèse de campagne — 4e mandat global « ok, fais tout »

## En-tête d'identification

**Quoi** : fin de mandat global (TF-0248, TF-0249, TF-0250). **Sur quoi** : pilot
digit-ai-forge-steering et digit-ai-forge-seo. **Quand** : 15/08/2026, fin à 17:05
(Europe/Paris), durée ≈ 30 minutes. **Qui** : session pilot (Fable), pilot@36f7cb7 → à
committer, seo@8263a8e.

## Verdict

Les trois items sont corrigés et archivés — registre à **0 actif / 250 archivés**, oracle
R1-R10 PASS — et la synthèse que tu lis a été écrite en fichier puis jugée par
`oracle-synthese` avant affichage.

## Décisions attendues de l'humain

Rien n'attend de décision : le registre est vide, le run d'audit concurrent sur
AuxPortesDeLaBaie suit son cours sous sa propre gouvernance.

## Traité — avec sa preuve

- TF-0248 — arbitrage de la plage machine-seo rendu sur preuve historique ;
  - preuve : grille 82 retrouvée (commit 54d25d0), 0 occurrence d'un nœud « Mesure » sur
    4 versions, transposition +6 confirmée titre à titre ; documenté au registre de
    correspondances SANS toucher au fichier haché (empreinte 0adef2177300 inchangée,
    validate 12/12, autotest 15/15, seo@8263a8e).
- TF-0249 — la consigne de restitution a ses appelants et son mécanisme ;
  - preuve : RESTITUTION.md v2.1.0 (§Appelants), noyau 6140/6144 (oracle-claude-md PASS),
    AGENT-CAMPAGNE §Synthèse, banc du pilot 9/9 — et cette synthèse-ci, jugée avant
    affichage (verdict au sidecar d'oracle du fichier).
- TF-0250 — collision de noms levée ;
  - preuve : `oracle-synthese.mjs` (git mv + renvois suivis), self-test 2/2, agrégateur 9/9.

## Non traité — avec son motif

- réécriture de la ligne « Mesure » dans la fiche machine-seo du produit — motif :
  bloqué par un garde-fou : un NOUVEAU run d'audit est actif sur la mission (2935f62,
  fiches régénérées à blanc), écrire dedans corromprait un run vivant ; l'arbitrage vit
  dans forge-seo et la nouvelle mission hérite de la numérotation juste.
- 2 citations des snapshots 20260808/20260809 — motif : écarté délibérément, livrables
  scellés portant la vérité de leur date, consigné au journal de mission depuis TF-0247.

## Écarts à la lettre

- tu as demandé « fais tout » → la moitié produit de TF-0248 n'est pas appliquée →
  parce qu'un run concurrent actif prime (garde-fou « produits autonomes ») ; la
  réécriture prête à l'emploi est dans le rapport d'agent, applicable si l'ancienne
  mission devait être remontée.

## Risques

- le run d'audit concurrent produit une mission neuve pendant que l'ancienne porte
  l'histoire corrigée ;
  - signal : un rapport final du run concurrent citant des nœuds sans passer par le
    registre de correspondances ;
  - parade : le registre corrigé (8263a8e) est dans forge-seo que ce run consomme — la
    numérotation juste est celle qu'il lit.

## Prochaines actions — ordonnées, et par acteur

- `auto_ia` — aucune : le mandat est soldé, le registre est vide.
- `manuelle_utilisateur` — d'abord laisser le run d'audit concurrent se terminer (c'est
  lui qui produit le prochain état du produit), ensuite seulement rouvrir une décision
  s'il remonte l'ancienne mission — cet ordre évite tout conflit d'écriture.

## Traces

- `todo\TODO.md` (0 actif) · `todo\TODO-ARCHIVE.jsonl` (250) ;
- `gabarits\RESTITUTION.md` (v2.1.0) · `gabarits\AGENT-CAMPAGNE.md` (§Synthèse) ·
  `oracles\oracle-synthese.mjs` · `CLAUDE.md` (§Parallélisme) ;
- forge-seo : `referentiel\correspondances-grille.json` (seo@8263a8e) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Campagne - Quatrieme mandat global - 20260815a.md`.
