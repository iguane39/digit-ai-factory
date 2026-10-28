---
destinataire: humain
---

# Synthèse Mandat — compétences Cloudflare, GitHub et Supabase construites dans 6 forges et au pilot (28/10/2026)

## 0. Synthèse d'ouverture

Les 8 compétences que vous avez demandées sont construites, vérifiées et publiées. Les forges savent désormais faire cinq choses qu'elles ne savaient pas faire : conseiller un déploiement Cloudflare par un expert dédié, planifier sa mise en production avec retour arrière, auditer un produit Cloudflare ou Supabase, juger la sécurité des automatisations GitHub d'un produit, et poser les questions de conception d'un produit qui combine les trois plateformes. Vos 14 dépôts publics bloquent aussi les envois de secrets côté GitHub. Le contrôle des automatisations, joué sur 4 de vos produits sans rien y écrire, y relève 8 défauts majeurs que je n'ai pas corrigés : il faut un run chez chacun. Une question vous revient : un nom de produit protégé reste dans l'historique public d'une forge.

## 1. En-tête d'identification

- **Quoi** : mandat transverse « Fais P1 & P2 & A1 & A2 », 8 compétences.
- **Sur quoi** : forge-agents, forge-ops, forge-audit, forge-websec, forge-conception et le pilot `digit-ai-factory`.
- **Quand** : 28/10/2026 de 10:15 à 11:55, heure de Paris (UTC+01:00).
- **Qui** : session pilote Claude Opus 5.5 ; 2 constructeurs Opus 5.5 (forge-agents, forge-websec), 3 agents de campagne Sonnet 5.5 (forge-ops, forge-audit, forge-conception), 2 relecteurs d'intention Sonnet 5.5.
- **Intention** : qu'un run de produit construit sur Cloudflare, GitHub Actions ou Supabase trouve dans les forges l'outillage de chaque étape.
- **Test rétro** : le résultat sert cette intention. Chaque ajout est appelé par le code qui sert déjà Supabase ou Azure, sa recette a été vue rouge avant le câblage puis verte après, et je l'ai rejouée moi-même avant de publier.

## 2. Verdict en une ligne

8 compétences sur 8 closes au registre, 6 forges et le pilot publiés (rev-list 0 0 chacun), 7 recettes rejouées par le pilot, toutes vertes hors 9 échecs de polices du poste antérieurs au mandat.

## 3. Décisions attendues

> **D-90 — Faut-il réécrire l'historique public de forge-audit pour retirer un nom de produit protégé, présent dans deux commentaires de test depuis le 02/10/2026 ?**
>
> - **De quoi s'agit-il** : le sigle d'un de vos produits, masqué « U•A », pseudonyme Produit-72, cité dans deux commentaires de test de forge-audit, enregistrés et publiés le 02/10/2026.
> - **Le problème** : je l'ai remplacé dans la version courante, mais il reste lisible dans 2 enregistrements publics. Les effacer réécrit l'historique d'un dépôt public que vos 2 postes clonent.
> - **Pourquoi vous** : réécrire un historique public est irréversible, et c'est une publication.
> - **Recommandation : (b)** — la porte de publication tient pour non bloquant ce qui précède l'inscription d'un nom à sa liste, et une réécriture forcerait la remise à niveau de l'autre poste pour un sigle de 3 lettres. Source consultée : la sortie de la porte de publication de forge-audit du 28/10/2026 (« 0 anteriorite(s), non bloquante(s) ») et la règle de la Factory sur les noms des dépôts publics.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Réécrire l'historique | je remplace le sigle dans tout l'historique de forge-audit, je publie en force, puis je remets l'autre poste à niveau à sa prochaine ouverture | moyen × court | Impossible : l'ancien historique a pu être copié |
| (b) Laisser l'historique tel quel | la version courante est propre ; le sigle reste lisible dans 2 enregistrements du 02/10 | nul | Possible : (a) reste faisable plus tard |
| (c) Rendre forge-audit privé | le dépôt sort de la vue publique, historique compris | simple × court | Possible : le repasser en public |

> **Sans réponse** : (b), l'historique reste tel quel.

## 4. Traité

- **TF-1994, forge-agents : expert Cloudflare.** Fiche, corpus de 13 points sur 36 pages datées, et baseline figée par une session neuve sans outil. Juge d'admission MATERIEL 5 axes sur 5, contre-épreuve 0 sur 5. Routage 9 sur 9 rejoué par moi.
- **TF-1995, forge-ops : plan de mise en production Cloudflare Workers.** La version est téléversée sans trafic, déployée par paliers, avec retour arrière natif. Self-test 219 → 240 PASS, 0 FAIL, rejoué par moi.
- **TF-1996, forge-audit et forge-websec.**
  - Le profil d'audit Cloudflare compte 7 contrôles sourcés.
  - Un oracle juge un fichier `_headers` par les 11 règles d'en-têtes déjà prouvées.
  - Recette de forge-websec 61 → 77 PASS.
- **TF-2006, forge-audit : profil Supabase.** Il passe de 7 à 15 contrôles, retrait des chiffrements TLS CBC du 10/11/2026 compris. Une copie d'outil dérivée de sa source a été relue et réenregistrée ; la recette complète passe de 13 sur 14 à 14 sur 14.
- **TF-2010, forge-ops et forge-conception.** Un document d'enchaînement des plans Supabase puis Workers, et un patron de 17 questions de conception appelé par la rédaction des exigences. Recette de forge-conception 175 → 184 OK.
- **TF-2001, forge-websec : sécurité des workflows GitHub Actions.**
  - 5 règles, chacune sourcée par docs.github.com ; recette 42 → 61 PASS.
  - Joué en lecture seule sur 15 workflows de 4 produits : 58 constats, dont 8 majeurs.
- **TF-2000, pilot : secrets locaux de wrangler.** R-14 et le gabarit `.gitignore` les couvrent ; self-test de conformité 191 PASS, 1 FAIL avant, 192 PASS, 0 FAIL après.
- **TF-2005, pilot : protections GitHub.**
  - Relevé de 14 dépôts, puis votre D-89 (a) et (b) appliquée.
  - 14 sur 14 avec détection des secrets, blocage des envois et alertes de vulnérabilité, contre 6, 6 et 0 avant.
- **Branchements au pilot et au poste.**
  - Les 2 oracles de websec sont inscrits au registre de `quality-oracles` 2.46.0 ; recette 12 échecs avec l'ancien registre, 9 avec le nouveau, ces 9 étant antérieurs.
  - 2 services ajoutés au catalogue du pilot, vues contrôlées PASS.
  - 3 skills propagés au poste ; contrôle des skills installés PASS.
- **Publication de forge-audit débloquée.** La porte refusait un nom protégé dans 2 commentaires de test. Je l'ai remplacé par son pseudonyme, puis j'ai rejoué les 2 enregistrements de l'agent par-dessus la correction, arbre identique vérifié.
- **Registre** : les 8 items sont passés de « décidé » à « corrigé », avec le gain mesuré et le moyen de descente ; `oracle-todo` PASS à chaque écriture.

Relecture d'intention : sert après 1 passe. La consigne des agents a été relue deux fois avant leur lancement.

## 5. Non traité

- **8 défauts majeurs des workflows chez 4 produits** : motif `produit`. Ce sont 7 jobs sans permissions déclarées et 1 action d'agent non épinglée, à corriger par un run chez chacun.
- **Variante Cloudflare Pages du plan de mise en production** : motif `hors_perimetre`, Cloudflare recommande Workers pour tout projet neuf.
- **9 échecs de la recette de `quality-oracles`** : motif `dependance_externe`. La stratégie de contrôle des applications du poste bloque une bibliothèque de polices ; ces échecs sont antérieurs au mandat.
- **Épinglage par SHA des actions officielles de GitHub** : motif `hors_perimetre`. Ces 40 constats restent mineurs ; la documentation admet l'étiquette pour un créateur de confiance.

## 6. Écarts à la lettre

| Vous avez demandé | J'ai fait | Pourquoi |
|---|---|---|
| TF-1995 : une cible de plan Workers « et variante Pages » | la cible Workers seule | Cloudflare écrit « Start new projects with Workers » |
| version mineure et CHANGELOG à chaque forge | versions montées là où un fichier les porte (experts-forge 1.6.0, forge-audit 1.20.0, quality-oracles 2.46.0) ; ni étiquette git ni CHANGELOG créé ailleurs | forge-ops, forge-conception et forge-agents n'ont pas de CHANGELOG, et forge-websec en a reçu un |
| la mise à jour des skills installés, présentée par un agent comme une décision humaine | jouée par la session | le code la décrit comme un remède mécanique, et l'ouverture de session la joue déjà |

## 7. Risques

- **Un envoi bloqué par le nouveau blocage des secrets.** Énoncé : une fixture qui imite un secret pourrait bloquer un envoi de forge. Signal : un `git push` refusé avec un message de blocage. Parade : corriger la fixture, ou débloquer l'envoi par le lien que GitHub donne, avec son motif.
- **Des pages officielles qui se contredisent.** Énoncé : la page Cloudflare d'intégration Supabase prescrit la clé « anon », que Supabase déclare dépréciée. Signal : le document d'enchaînement et le patron le signalent. Parade : trancher à la conception de chaque produit.

## 8. Prochaines actions

| Sélecteur | Item | Acteur | Motif | Chemin ou commande | Coût de ne pas la faire |
|---|---|---|---|---|---|
| A-1 | neuve | manuelle_utilisateur | décision D-90, réécriture irréversible d'un historique public | répondre « 90a », « 90b » ou « 90c » | aucun, (b) s'applique par défaut |
| A-2 | neuve | manuelle_utilisateur | écrire chez un produit autonome demande un run | demander un run chez chacun des 4 produits pour corriger les 8 défauts majeurs de leurs workflows | 7 jobs gardent les droits par défaut de leur dépôt |

## 9. Traces

- Registre : `todo/TODO.jsonl`, TF-1994 à TF-1996, TF-2000, TF-2001, TF-2005, TF-2006 et TF-2010 en « corrigé ».
- Décisions : `decisions/REGISTRE.jsonl`, D-89 et D-90.
- Pilot : `oracles/oracle-conformite-projet.mjs`, `gabarits/gitignore-produit`, `catalogues/catalogue.jsonl`, `output/03-etudes/Digit-AI - Inventaire - Protections GitHub des depots publics - 20261028a.md`.
- forge-agents 2e2adfb : `.claude/skills/experts-forge/fiches/expert-ops-cloudflare.md`, `.claude/skills/quality-oracles/references/registre-oracles.json`.
- forge-ops 5991a6b : `scripts/ops.mjs`, `references/ENCHAINEMENT-PLANS.md`.
- forge-audit ee0c944 : `profiles/cloudflare/`, `profiles/supabase/`, `HERITAGE.json`.
- forge-websec ddade63 : `oracles/oracle-workflows.mjs`, `oracles/oracle-exposition-statique.mjs`.
- forge-conception 5c23ab3 : `skills/redige-les-exigences/references/patron-plateformes-workers-supabase-actions.md`.
- Relectures d'intention : `todo/relectures-intention.jsonl`, RI-20261028-01 et RI-20261028-02.
