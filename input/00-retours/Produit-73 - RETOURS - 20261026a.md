# Retours forges — Produit-73 — 20261026a

- **Contexte** : autre — session hors run du 26/10/2026 (production d'une fiche DPO A4) ; trois défauts de process relevés par l'humain (« Pourquoi A1 n'est pas fait d'office ? », puis « il y a une erreur dans le process et ça ne remonte pas à la Factory, pourquoi ? »).
- **Références ledger** : `forge\ledger.jsonl` seq 143, 144 (entrées `type: retour`) et seq 145 (troisième retour, consigné avec ce lot).
- **Remise au pilot** : copier ce fichier (et son sidecar) dans le SAS
  `<pilot>\input\00-retours\_arrivee\` (ignoré par git), jamais à la racine de `input\00-retours\` :
  le pilot l'y dépose lui-même après pseudonymisation (`todo\accueillir-lot.mjs`, TF-0981) ; un lot
  au nom réel posé à la racine est refusé (règle LOT-SAS de l'oracle, TF-1054) —
  l'original reste ici (historique du produit). Statut : `a_remettre` → `remis le <date>`
  (seule édition autorisée après coup : cette ligne de statut).
- **Statut** : a_remettre

---

## forge-design (`digit-ai-forge-design`)

Une fiche HTML d'une page est passée au vert à trois contrôles de rendu alors qu'elle affichait des caractères parasites dans quatre pastilles ; seule la relecture d'une capture l'a vu.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RD-1 | majeur | générique | **Octets de contrôle dans le CSS d'une page livrée, invisibles à trois oracles.** Deux `content` de pseudo-éléments écrits par un script Python avec `\25F7` dans une chaîne ont reçu l'octet 0x15 puis l'octet 0x00 (séquence lue comme un échappement octal). Rendu : « □F7◆A0 » dans quatre pastilles. *Mesuré le 26/10/2026* : `run-oracles-design.mjs` → « PASS — tous les oracles applicables sont verts » ; `render_page.py` sur 7 largeurs → « Verdict : PASS » ; `check_html.py` du socle Client-A → « Verdict : PASS » ; lecture binaire du fichier → 2 octets de contrôle. Défaut trouvé uniquement sur capture relue. | Câbler `oracle-caracteres-controle.mjs` (CC1, déjà au pilot, TF-1067) dans `run-oracles-design.mjs`, `check_html.py` et `render_page.py` : tout octet de contrôle hors tabulation et fin de ligne dans un `.html` livré est bloquant. Règle qui aurait évité le retour : la classe `sequence-octale-interpretee-au-rendu` prescrit déjà CC1 « à chaque régénération », mais seulement pour le générateur du registre. |

**Portée** (R-45, 21/08) : *générique* — tout livrable HTML écrit par un script peut porter ces octets, et aucun des trois contrôles de livraison ne les voit.

## pilot (`digit-ai-factory`)

Deux règles de restitution ont laissé passer, dans le même après-midi, une critique jouable non jouée puis une remontée renvoyée à une clôture de run qui n'existait pas. Les deux défauts ont été relevés par l'humain, pas par le hook.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RV-15 | majeur | générique | **Une page HTML citée comme livrée sans critique d'implémentation, acceptée par le hook.** La restitution du 26/10 à 17:04 citait la fiche comme livrée et laissait la critique forge-design en action A-1, `auto_ia`, motif `hors_mandat`. `--prejuger` → `"affichable":true`, aucun bloquant. Jouée ensuite sur demande de l'humain, la critique a trouvé 4 bloquants (S1, V16 ×3 couleurs indiscernables, L2) et 19 majeurs (T3). | Étendre S36 et la règle v2.19.0 (« un test jouable s'exécute ») : refuser `hors_mandat` et `borne_atteinte` pour une action de critique ou d'oracle jouable dans le tour, comme pour un test. Règle qui aurait évité le retour : S36 (`restitution-rendu-visuel-non-critique`), contournée par le report en bloc 8. |
| RV-16 | majeur | générique | **« Reste au produit » accepté pour une remontée sans échéance réelle.** Dans un tour qui venait de corriger une erreur de la session, la ligne « Remontée à la factory : reste au produit, parce que les deux retours consignés au ledger (seq 143 et 144) partent avec le lot de clôture du run » a été acceptée par S48 (`--prejuger` → `"affichable":true`). Aucun run n'était ouvert dans la session : la clôture qui devait porter le lot ne viendrait jamais. Le `CLAUDE.md` du produit ne prévoit la compilation du lot qu'« à la clôture de tout run ». | S48 : après une correction, n'accepter que le lot nommé et remis ; « reste au produit » n'est admis que si un run est ouvert au ledger (dernier `run_open` sans `run_close`). Gabarit `CLAUDE-PRODUIT.md` : compiler et remettre le lot à la fin du tour quand aucun run n'est ouvert. Règle qui aurait évité le retour : TF-1643 (S48), dont la formule « reste au produit » est la sortie non jugée. |

**Portée** (R-45, 21/08) : les deux sont *génériques* — elles tiennent à `oracle-synthese` et au gabarit du `CLAUDE.md` produit, communs à tous les produits.

## Rattachement

Registre interrogé le 26/10/2026 :

- `grep -c -i -- "caracteres-controle" todo/TODO.jsonl` → 9 ligne(s) trouvée(s), sortie complète relue.
- `grep -c -i -- "S36" todo/TODO.jsonl` → 7 ligne(s) trouvée(s), sortie complète relue.
- `grep -c -i -- "reste au produit" todo/TODO.jsonl` → 7 ligne(s) trouvée(s), sortie complète relue.

Items recoupés : TF-1067 (CC1 créé pour le générateur du registre, non câblé aux contrôles de livraison) pour RD-1 ; TF-0775 (fondateur de S36) et TF-1653 (S36 corrigé sur un faux positif) pour RV-15 ; TF-1643 (« rien à remonter » refusé après correction, corrigé) pour RV-16. Chacun est une récidive de sa classe.

## Remarques restées au produit

- La fiche DPO portait aussi 19 espacements hors de l'échelle de 4 px et un bandeau latéral de 3 px (T3, S1), corrigés au produit. Généralisable : non — les oracles les ont vus et ont tenu leur rôle.
- Le motif `hors_mandat` posé sur la critique est une erreur de la session, corrigée dans le tour. Généralisable : oui → remonté en RV-15, parce que le hook l'a laissé passer.

## Retours sur les documents produits

| Document produit | Gabarit employé + version | Ce qui a manqué | Ce qui a GÊNÉ LE LECTEUR | Ajouté à la main | Portée |
|---|---|---|---|---|---|
| `output\10-fiches-dpo\Ventilation Fournisseur-A - Fiche DPO - 20261026a.html` | gabarit non marqué : `skills\client-a-page-html\assets\boilerplate.html` (socle Client-A) — aucune version du gabarit déclarée dans le document | aucune famille « fiche DPO / registre art. 30 » dans `gabarits\documents\` | l'humain a demandé pourquoi la critique n'était pas jouée d'office | toute la structure de la fiche (finalité, personnes, données, destinataires, conservation, droits, demandes au DPO) | générique |

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- **La critique forge-design a fait son travail une fois jouée** : 4 bloquants et 19 majeurs trouvés sur une page que la charte Client-A déclarait PASS ; `render_page.py` a mesuré V16 (écart de couleur 10,8 à 17,2 pour un seuil de 20) et L2 (colonne d'intitulés à 27 et 36 % pour un seuil de 20 %).
- **La garde contre `rm` avec variable a tenu** : une suppression dont la cible passait par une variable a été refusée avant exécution, et le contrôle a été rejoué dans un dossier neuf.

## Ordre recommandé

1. RV-16 — sans lui, tout retour d'une session hors run peut rester au produit indéfiniment, et c'est ce que l'humain a dû relever.
2. RD-1 — le câblage d'un oracle existant suffit, et il ferme un faux négatif sur trois contrôles de livraison.
3. RV-15 — une extension de S36 ; le hook de restitution ne refuse aujourd'hui que la citation d'une page sans critique, pas son report.

## La règle qui aurait évité le retour

- **RD-1** — `sequence-octale-interpretee-au-rendu` : son oracle CC1 existe, mais il n'est joué que sur le générateur du registre.
- **RV-15** — `restitution-rendu-visuel-non-critique` : S36 existe et a été contourné par un report en `auto_ia hors_mandat`.
- **RV-16** — `remontee-declaree-nulle-apres-correction` : S48 existe ; la formule « reste au produit » sans run ouvert n'est pas jugée.
