---
destinataire: humain
---

# Synthèse Mandat — tri des favoris TikTok du 19/10/2026

## 0. Synthèse d'ouverture

Vos 109 favoris TikTok sont triés. 51 vidéos touchent la Factory, et elles se regroupent en 18 opportunités notées sur 25, classées de la plus pertinente à la moins pertinente. Les 4 premières dépassent 19 et méritent une étude poussée : le jeton d'abonnement pour les tâches sans écran, les tactiques SEO et GEO récentes, les packs d'agents tiers et les skills de design tiers. Toutes les notes reposent sur les légendes des vidéos, car aucune vidéo n'a pu être regardée sur ce poste. Le choix des études à lancer vous revient, il est posé en D-39.

## 1. En-tête d'identification

Tri des favoris TikTok de l'humain en opportunités pour le pilot `digit-ai-factory`. Période : 19/10/2026 de 16:35 à 16:45, heure de Paris (UTC+02:00), heure de fin relevée par `date`. Session pilote Claude Opus 5.5, un agent `verificateur` sur Sonnet pour la relecture d'intention.

Intention de la demande : savoir quelles vidéos mises en favori valent une étude d'opportunité pour améliorer la Factory, avec une note qui permet de choisir et de prioriser.

Test rétro : le résultat sert cette intention. Le tri note et classe 18 opportunités, et chaque vidéo pertinente y est rattachée par son numéro et son lien.

## 2. Verdict en une ligne

109 vidéos rangées, 51 pertinentes, 18 opportunités notées et classées, 4 recommandées pour une étude poussée ; 1 décision vous revient.

## 3. Décisions attendues

Rien n'est bloqué en dehors de ce choix, posé ci-dessous.

> **D-39 — Quelles études d'opportunité poussées lancer, et dans quel ordre, parmi les 18 opportunités du tri des favoris TikTok ?**
>
> De quoi s'agit-il : le tri `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` classe 18 opportunités tirées de vos favoris, et vous avez demandé à choisir vous-même les études poussées.
>
> Le problème : une étude poussée au gabarit `gabarits\ETUDE-OPPORTUNITE.md` demande des sources datées et 5 options comparées, son coût est moyen pour chacune.
>
> Pourquoi vous : le périmètre et la priorité des études sont votre arbitrage, selon votre demande de ce tour.
>
> **Recommandation : (a).** Source consultée : le classement du tri donne 21, 20, 19 et 19 sur 25 aux 4 premières, et 17 au plus aux suivantes.

| Option | Ce qui se passe | Coût | Retour arrière |
|---|---|---|---|
| (a) Lancer les 4 premières dans l'ordre du classement | Jeton d'abonnement, puis SEO et GEO, puis packs d'agents tiers, puis skills de design tiers | Moyen × moyen | Arrêter une étude à tout moment |
| (b) Lancer seulement les 2 premières | Jeton d'abonnement, puis SEO et GEO | Moyen × court | Ajouter les autres plus tard |
| (c) Une autre liste, que vous donnez par les rangs du tri | Les études suivent votre ordre, y compris un essai court sur graphify | Selon la liste | Le même |

> **Sans réponse** : rien n'est lancé, le tri reste au dossier des études.

## 4. Traité

Le tour a lu la page enregistrée, comparé chaque sujet à l'existant de la Factory et écrit le tri, sa règle d'exclusion et cette synthèse.

- **Extraction des 109 favoris.** Un script a relevé le lien et la légende de chaque vidéo de la page enregistrée dans `input\Tiktok\`. 102 vidéos portent une légende, 7 n'en portent aucune.
- **Rangement contrôlé.** Le script de rangement vérifie qu'aucune vidéo n'est rangée 2 fois et qu'aucune n'est oubliée. Il rend 109 vidéos rangées : 51 dans les 18 opportunités, 58 hors du tri.
- **Comparaison à l'existant.** `todo\TODO.jsonl` ne cite aucun des outils nommés par les vidéos, ni `setup-token`, ni GStack, ni Scrapling. Le skill graphify est installé, mais aucun dépôt `digit-ai-*` n'a de dossier `graphify-out`.
- **Tri écrit.** `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md` porte la grille de notation, le classement, une étude courte par opportunité et l'annexe des 109 vidéos. `oracle-ecriture` rend PASS, après correction d'un en-tête de colonne qui l'avait rendu rouge.
- **Page de favoris tenue hors de git.** Le pilot est public, selon `gh repo view`, et la page porte des adresses signées de votre session. `.gitignore` exclut désormais `input\Tiktok\`, et `git check-ignore` le confirme sur le chemin absolu `C:\dev\digit-ai-factory\input\Tiktok\` ; son rôle est déclaré dans `scripts\readme-dossiers.mjs`.
- **Numéro de décision réservé.** `scripts\reserver-decision.mjs` a inscrit D-39 au registre des décisions.
- Relecture d'intention : sert après 1 passe, consignée sous RI-20261019-16. L'écart choix_humain relevé, l'opportunité 18 écartée sans vous, est repris : le tri la recommande à écarter et vous laisse le choix, et `oracle-ecriture` rend PASS après la reprise. Les 2 écarts mineurs restants sont assumés : la note porte sur l'opportunité, et le tri ne lit que les légendes.

## 5. Non traité

Ces éléments restent ouverts, aucun ne retient le tri.

- **Le contenu des vidéos** — motif : borne_atteinte, le poste n'a ni `yt-dlp`, ni `ffmpeg`, ni modèle de transcription, et les conditions de TikTok interdisent l'extraction automatisée.
- **Les 10 vidéos sur l'IA à la légende trop vague** — motif : borne_atteinte, seul leur contenu permettrait de les ranger.
- **Les candidatures au registre** — motif : decision, chaque opportunité retenue en D-39 entrera en candidat avec son étude.
- **La publication du pilot** — motif : decision, déjà posée en D-38 au tour de 12:08.
- **`todo\relectures-intention.jsonl`** — motif : hors_mandat, le fichier porte aussi des lignes d'une autre session ; je ne les enregistre pas à sa place.

## 6. Écarts à la lettre

Vous demandiez une courte étude pour chaque vidéo. J'en ai écrit une par opportunité, parce que plusieurs vidéos montrent le même outil. Chaque vidéo y est citée par son numéro, et l'annexe donne son rangement.

## 7. Risques

- **Une note fondée sur une légende peut se tromper.**
  - Énoncé : une vidéo à la légende courte peut être plus utile que sa note ne le dit, par exemple celle sur les fabriques logicielles autonomes.
  - Signal : une étude poussée qui trouve un contenu plus riche, ou plus pauvre, que la légende.
  - Parade : regarder les vidéos 25 et 13 avant d'en tirer une étude, ou fournir leur fichier.

## 8. Prochaines actions

Votre choix vient d'abord, parce que les études en dépendent.

| Sélecteur | Registre | Action | Acteur | Motif / raison | Commande | Coût si non fait |
|---|---|---|---|---|---|---|
| **A-1** | `neuve` | Écrire les études poussées choisies, au gabarit d'étude d'opportunité | auto_ia | dependance_bloc_3 : attend D-39 | `node oracles/oracle-etude-opportunite.mjs <étude>` | Les opportunités restent au tri, sans suite |
| **A-2** | `neuve` | Trancher D-39 | manuelle_utilisateur | decision | Répondre dans la conversation, par exemple `D-39 a` | Rien n'est lancé |

## 9. Traces

- `output\03-etudes\20261019-tri-opportunites-favoris-tiktok.md`
- `.gitignore` et `scripts\readme-dossiers.mjs`, pour la page de favoris tenue hors de git
- `decisions\REGISTRE.jsonl`, D-39 réservée à 16:41
- `todo\relectures-intention.jsonl`, RI-20261019-16
