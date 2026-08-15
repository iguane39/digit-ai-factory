# TODO-FORGE — registre d'amélioration de l'écosystème

<!-- VUE GÉNÉRÉE par generer-vue.mjs — NE PAS ÉDITER. Source unique : TODO.jsonl.
     sceaux: actifs=584ece753b8a archive=966a94eb82cb · dernier événement: 2026-08-15T10:20:06Z -->

**7 actifs** (candidat 6 · décidé 0 · en cours 0 · corrigé 1 · écarté 0) · **234 archivés**.
Gouvernance : tout entre en *candidat* ; seul un mandat humain passe en *décidé* (« décide TF-xxxx »).
Score = gain × preuve (×2 payé en run réel) ÷ effort.

## digit-ai-forge-agents

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0233 | candidat | 3.5 | socle HTML : L3 signale le CONTENEUR d'une valeur alors que la legende est portee par le nombre qu'il contient | **oui** — reproduit sur montage minimal et confirme anterieur par rejeu sur la version d'avant correction : un KPI correctement legende produit tout de meme un echec L3 sur son conteneur |

## digit-ai-forge-design

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0235 | corrige | 3 | Doctrine « restitution lisible » : les dashboards HTML des forges se conçoivent pour leurs lecteurs | **oui** — mesuré sur le rapport SEO 20260809k : 491 Ko sur une page, 0 canvas/svg pour des centaines de valeurs, 11 chapitres empilés — et une maquette de refonte jugée conforme par les oracles du socle (13 PASS) |

## digit-ai-forge-seo

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0240 | candidat | 4 | forge-seo : aucune voie de migration d'une mission auditee vers une grille renumerotee | **oui** — vecu en campagne : la regeneration a exige un worktree epingle a l'ancien commit — chaque future evolution de grille reproduira le blocage sur toute mission passee |

## pilot

| id | statut | score | titre | payé en réel |
|---|---|---|---|---|
| TF-0239 | candidat | 8 | runner quality-oracles : le budget global de 120 s tue oracle-claims sur les gros livrables | **oui** — mesure sur le rapport 20260815a : oracle-claims seul = PASS en 426 s ; sous le runner = FAIL par timeout a 120 s |
| TF-0236 | candidat | 6 | Profils UI : qualité graphique par défaut — DA dérivée de l'expérience client via systeme-de-marque, oracle de généricité, baseline visuelle | **oui** — le PROMPT-PRODUIT.md de forge.digit-ai.fr (15/08) a dû nommer manuellement studio de direction, oracle de généricité et baseline visuelle : l'opt-in laisse passer le rendu générique par défaut |
| TF-0237 | candidat | 6 | ETAPES-RUN : alignement DA↔expérience client et contrôle de généricité en gates par défaut des étapes design et 5 bis | **oui** — étape 5 bis déjà câblée mais sans exigence anti-généricité : un run dont le brief est muet produit un rendu template sans qu'aucun oracle ne le signale |
| TF-0238 | candidat | 2 | Loi transverse candidate : « un rendu générique est un défaut, pas un goût » | **oui** — sans rang de loi, la règle reste dispersée entre profils et références : un run hors profil UI (produit atypique) peut encore l'ignorer silencieusement |

---
Détail d'un item : `grep '"id":"TF-xxxx"' todo/TODO.jsonl` (tous ses événements). Archive : même commande sur TODO-ARCHIVE.jsonl.
