# Synthèse de mandat — « revois le prompt du SEO » (TF-0251)

## En-tête d'identification

**Quoi** : fin de mandat direct (vocabulaire du prompt d'usage SEO). **Sur quoi** :
pilot (catalogue, ACCUEIL) et digit-ai-forge-seo (README, new_mission.py). **Quand** :
15/08/2026, fin à 17:25 (Europe/Paris), durée ≈ 15 minutes. **Qui** : session pilot
(Fable), pilot@bf41af0 → à committer, forge-seo@8263a8e → à committer.

## Verdict

Ta lecture est confirmée et corrigée partout : validate 12/12 · autotest 15/15 ·
catalogue `--check` PASS · 0/3 formulations « produit » restantes — l'objet audité est
un **site en ligne**, le « projet » n'est que le **dossier hôte**.

## Décisions attendues de l'humain

Rien n'attend de décision : le registre est à 0 actif, aucune option ouverte.

## Traité — avec sa preuve

- confirmation du diagnostic : l'audit cible un site (`--domaine`, `--url`, exports
  GSC/GA) ; un client SEO peut n'avoir aucun logiciel forge, un produit n'a de SEO que
  par son site en ligne — preuve : cat-seo-01 disait « chez mon produit »,
  new_mission.py « DANS LE PROJET AUDITE » (constatés avant correction) ;
- source unique corrigée : catalogue v1.6.1, cat-seo-01 → « pour mon site — l'étude
  vit dans le dossier du projet hôte » — preuve : `generer-vues.mjs --check` PASS ;
- forge-seo aligné (README : « l'objet audité est un site en ligne », docstring de
  new_mission.py : dossier HÔTE vs SITE audité, section catalogue miroir v1.6.1) —
  preuve : validate 12/12, autotest 15/15, grep résiduel = 0 ;
- routage ACCUEIL précisé (« auditer le SEO d'un site en ligne ») et TF-0251 tracé de
  bout en bout au registre — preuve : oracle R1-R10 PASS, 0 actif / 251 archivés.

## Non traité — avec son motif

- la mécanique des scripts (`--projet` comme ancre du dossier hôte) — motif : hors
  mandat et correcte sur le fond ; seul le vocabulaire mentait, pas le contrat.

## Écarts à la lettre

Aucun : « revois le prompt » a été traité comme revue PUIS correction du vocabulaire
d'usage, sans toucher à la mécanique — c'est le périmètre littéral de la remarque.

## Risques

- une future entrée de catalogue réintroduise « produit » pour un service SEO ;
  - signal : `generer-vues.mjs --check` reste vert (il ne juge pas le vocabulaire) —
    la relecture humaine du catalogue est le seul filet ;
  - acceptation déclarée : un oracle de vocabulaire serait disproportionné pour un
    mot ; la définition vit désormais en tête du README de la forge.

## Prochaines actions — ordonnées, et par acteur

- `auto_ia` — aucune : mandat soldé, registre vide.
- `manuelle_utilisateur` — rien d'obligatoire ; à la prochaine mission SEO, le cadrage
  dira « site » d'entrée — d'abord vérifier ce vocabulaire au cadrage, parce que c'est
  lui que tous les livrables recopient ensuite.

## Traces

- `catalogues\catalogue.jsonl` (v1.6.1) · `catalogues\CATALOGUES.md` (régénéré) ;
- forge-seo : `README.md`, `scripts\new_mission.py` ;
- `references\ACCUEIL.md` · `todo\TODO.md` (0 actif) ;
- ce fichier : `output\04-plans\Digit-AI - Synthese Mandat - Vocabulaire SEO site vs produit - 20260815a.md`.
