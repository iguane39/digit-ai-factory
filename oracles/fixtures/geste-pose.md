La publication de la version corrigée attend encore votre mot : tout est prêt en local, vérifié sur un clone frais, et rien n'est parti vers le dépôt distant. Ce que cela change : la correction reste chez vous tant que le geste n'est pas fait, les autres postes continuent sur la version d'hier. Ce qui est attendu de vous : une seule décision, ci-dessous, sur le moment de la publication.

## 1. En-tête
- quoi : synthèse du mandat de publication · sur quoi : la factory · quand : 2026-09-10 21:40 (Europe/Paris), durée 40 min · qui : pilot v1.17.19.

## 2. Verdict
- Recette du pilot 22/22 verte, clone frais mesuré à 683 commits.

## 3. Décisions attendues

> **D-11 — Publier maintenant la version corrigée du démarrage, ou attendre demain matin ?** Le contrôle vient de passer en entier sur un clone frais, donc la version est prête ; la seule question est de savoir si on la met à disposition des autres postes tout de suite, ou si on garde une nuit pour un dernier regard humain avant qu'elle ne circule.
>
> **Recommandation : (a).** Source consultée : `references\ETAPES-RUN.md` — le journal `recette.md` ne porte aucun défaut ouvert, et la règle de publication y est écrite.

| Option | Ce qu'elle coûte | Ce qu'elle exclut |
|---|---|---|
| (a) pousser maintenant | nul | un dernier regard humain |
| (b) pousser demain matin | un poste périmé une nuit | la mise à disposition immédiate |
| (c) ne rien publier | la version corrigée reste locale | toute diffusion aux autres postes |

> **Si rien n'est décidé** : (c) s'applique — la version reste locale, personne ne la reçoit.

## 4. Traité
- bootstrap v2 livré — preuve : bootstrap.test.mjs 7/7, recette 22/22.

## 5. Non traité
- la propagation sur les postes qui ne relancent jamais bootstrap — motif : hors de portée de ce correctif, couvert par la garde d'ouverture.

## 6. Écarts à la lettre
- aucun écart.

## 7. Risques
- un poste hors ligne ne vérifie pas sa fraîcheur — signal : avertissement « origin injoignable » au rapport ; parade : le défaut est dit, jamais masqué.

## 8. Prochaines actions
- **A-1** — auto_ia : TF-0001 rejouer la recette au prochain démarrage (d'abord, parce que gratuit).
  - motif de non-exécution : dependance_bloc_3 — attend la décision ci-dessus.
  - si rien n'est fait : la recette reste jouée sur l'état d'avant, donc son vert ne prouve rien.
- **A-2** — manuelle_utilisateur : TF-0002 trancher l'option ci-dessus (ensuite, parce que tout le reste en dépend).
  - pourquoi pas l'IA : decision — arbitrage humain, R-29.
  - où : répondre `11a`, `11b` ou `11c` dans ce fil de conversation, au bloc 3 de ce message.
  - si rien n'est fait : le poste reste sur la version d'hier et toutes les suites attendent.
- manuelle_dev : aucune.

## 9. Traces
- `oracles\fixtures\geste-rouge.jsonl`, `oracles\fixtures\geste-vert.jsonl`.
