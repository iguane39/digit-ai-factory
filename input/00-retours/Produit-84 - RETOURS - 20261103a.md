# Retours forges — Produit-84 — 20261103a

- **Contexte** : essai make-it-better sur le deck d'expression de besoin du POC, du 02/11/2026 15:15 au 03/11/2026 10:48. Le porteur a demandé une page de comparaison autonome, puis : « pourquoi ma demande d'une page autonome n'est pas remontée à la Factory pour l'appliquer au skill Make it better de la Factory ? ».
- **Références ledger** : `forge\ledger.jsonl` seq 161, 162, 163 et 164 (entrées `type: retour`).
- **Remise au pilot** : copier ce fichier et son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`, jamais à la racine de `input\00-retours\`. Statut : `a_remettre` → `remis le <date>`.
- **Statut** : remis le 2026-11-03
- **Complétude** : 4 retours, tous nés de cet essai. Les 41 entrées `type: retour` plus anciennes que le relevé d'ouverture signale sans lot ne sont pas reprises ici.

Convention de gravité : **bloquant** (a bloqué ou failli bloquer) · **majeur** (a coûté un aller-retour) · **mineur** (confort, précision).

## Ce qui s'est passé

- **L'essai.** 8 tours Opus sur le deck, arrêt sur 2 réponses « rien » de suite : 4 versions gardées, 2 rejetées. L'une des 2 rejetées l'est à tort (RA-1).
- **La page servie.** `serveur-versions.mjs` tourne sur 127.0.0.1. La restitution donnait son adresse seulement en code au tableau du bloc 8 ; le porteur ne l'a pas trouvée (RT-32).
- **La page autonome.** Le porteur a demandé la même page sans serveur, sans enregistrement, avec des images faites en amont. Elle est construite chez le produit et jugée verte : 13 oracles de design sur 13, recette Chromium 19 cas sur 19 (RA-2).
- **La remontée manquée.** La restitution de cette construction disait « Remontée à la factory : rien de neuf ». Le porteur a dû demander la remontée (RT-33).

## Forge agents (`digit-ai-forge-agents`) — skill make-it-better

2 retours : un faux positif d'oracle, une évolution demandée par le porteur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RA-1 | majeur | générique | **FS2 lit une énumération de sigles comme un seul nom.** Tour 006 de l'essai `opus-1` rejeté avec le motif « fait absent de l'origine et de sources/ : DPO RSSI ADR0604 ». La version écrivait « (DPO, RSSI, ADR0604) » ; l'origine porte « par le DPO et le RSSI (ADR0604) ». `extraireNoms('classement des données (DPO, RSSI, ADR0604)')` de `scripts/oracle-faits-sources.mjs` rend `["DPO RSSI ADR0604"]` : la virgule n'est pas une coupure de groupe. Ledger seq 161. | Ajouter la virgule aux coupures de groupe de `extraireNoms`, ou juger chaque sigle d'un groupe absent séparément. Une fixture rouge : la phrase ci-dessus, tous ses sigles présents dans le corpus. Règle qui aurait évité le retour : aucune, FS2 n'a pas de cas d'énumération. **RA-1** : classe existante `oracle-faux-positif`. |
| RA-2 | majeur | générique | **La page de versions ne se partage pas.** Elle n'existe que servie par `serveur-versions.mjs` : elle meurt avec la session et ne s'envoie pas. Le porteur a demandé une page autonome, enregistrement retiré, images faites en amont. Construite chez le produit : `output/06-comparaisons/Produit-84 - Comparateur - Versions make-it-better de la fiche expression de besoin - 20261103a.html`, 3,7 Mo, 7 images uniques embarquées, écart pixel et texte marqué calculés en JavaScript, aveugle tiré par `crypto.getRandomValues`. Générateur, gabarit et recette : `forge/etapes/comparateur/`. `run-oracles-design --rendu` : 13 PASS sur 13 ; recette Chromium : 19 sur 19. Ledger seq 163. | Une commande `exporter-page.mjs --espace <e> [--essai <id>]` au skill, reprise du générateur du produit : aperçus embarqués, mêmes `SEUIL_PIXEL` et `ZONES_MAX` que `formats.py pages-ecart`, aveugle déclaré partiel puisque la correspondance vit en mémoire de la page. Règle qui aurait évité le retour : aucune, le skill ne déclare pas de sortie de partage. Écart mesuré à reprendre : le texte marqué compte 6 mots retirés, le skill 5, sur la paire origine contre tour 005. **RA-2** : classe proposée `skill-sans-sortie-partageable`. |

## Factory (`digit-ai-factory`) — gabarit de restitution et remontée

2 retours, nés de 2 questions du porteur.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RT-32 | majeur | générique | **La page à ouvrir n'est pas en tête de la restitution.** Restitution du 02/11/2026 16:13 : l'adresse `http://127.0.0.1:4750/` n'apparaît qu'en span de code dans l'action A-1 du bloc 8. Le bloc 0 interdit chemins et spans de code, et la ligne « Livré : » (S87) ne couvre que les fichiers écrits sous `output/`. `--prejuger` a rendu la restitution affichable. Retour du porteur : « La page à ouvrir n'est même pas dans le prompt de restitution, comment c'est possible ? ». Ledger seq 162. | Étendre l'exception de S87 à une ligne « À ouvrir : [<nom>](<adresse>) » en fin de bloc 0, dès qu'une action `manuelle_utilisateur` du bloc 8 porte une adresse http(s) ; oracle-synthese avertit si elle manque. Règle qui aurait évité le retour : S87 (TF-1973, TF-2016), qui ne vise que les fichiers. **RT-32** : classe existante `restitution-sans-acces-au-service-livre`. |
| RT-33 | majeur | générique | **Une évolution de skill demandée par le porteur n'est pas remontée.** Restitution du 03/11/2026 10:45 : « Remontée à la factory : rien de neuf », dans le tour où la session construisait, à la demande du porteur, une capacité que le skill make-it-better n'a pas (RA-2). `--prejuger` l'a jugée affichable. Retour du porteur : « pourquoi ma demande d'une page autonome n'est pas remontée à la Factory pour l'appliquer au skill Make it better de la Factory ? ». Ledger seq 164. | Le hook de restitution avertit quand le tour a lancé ou lu un skill de la Factory, a écrit un livrable que ce skill ne produit pas, et n'a écrit aucun retour au ledger. Règle qui aurait évité le retour : aucune, la règle de remontée juge les corrections d'erreur, pas les demandes d'extension. **RT-33** : classe existante `remontee-declaree-nulle-apres-correction`. |

## Rattachement

Registre interrogé le 03/11/2026, chaque commande jouée sans borne au pilot :

- `grep -ciE "extraireNoms|oracle-faits-sources" todo/TODO.jsonl` → 1 ligne(s) trouvée(s) : TF-2050 (création du skill make-it-better), qui ne porte pas le cas de la virgule.
- `grep -ciE "page autonome" todo/TODO.jsonl` → 1 ligne(s) trouvée(s) : TF-1062 (oracle-a11y), sans rapport.
- `grep -ciE "make-it-better" todo/TODO.jsonl` → 8 ligne(s) trouvée(s) : TF-2050, TF-2051, TF-2061 (format PowerPoint), TF-2062, TF-2064 ; aucune ne porte une sortie de partage.
- `grep -ciE "adresse à ouvrir|lien de la page|service livré|S87" todo/TODO.jsonl` → 4 ligne(s) trouvée(s) : TF-1973 et TF-2016 (ligne « Livré : »), que RT-32 étend.

Items recoupés : TF-2061 pour RA-2 (même skill, même essai), TF-1973 et TF-2016 pour RT-32. Aucun item ne porte RA-1 ni RT-33.

## Remarques restées au produit

- La page autonome reste chez le produit tant que le skill ne l'exporte pas ; son générateur se rejoue par `node forge/etapes/comparateur/generer.mjs --espace <espace> --sortie output/06-comparaisons --jour <AAAAMMJJ>`. Généralisable : non, la généralisation passe par RA-2.

## Retours sur les documents produits

Aucun document produit depuis un gabarit de la bibliothèque sur ce lot.

## Documents mûrs

Aucun document mûr sur ce lot.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `--reprendre`, la pause de quota et les arrêts fixés d'avance n'ont pas eu à servir, et le lanceur a rendu un état lisible : 8 tours, 53 s par tour, quota inchangé à 0,11.
- Le seuil de 10 % par forme a protégé la diapositive : l'image de la version 5 montre la case Contraintes et risques sans débordement.
- Le tour 002 a corrigé une incohérence de la fiche d'origine (« ≈ 200 à 300 €/mois » contre « 198 à 249 €/mois »), sourcée à la page 9 de la Design Review.

## Ordre recommandé

1. RA-1 : une ligne de code et une fixture, et chaque faux rejet compte pour l'arrêt à 3 rejets.
2. RT-33 : sans lui, chaque extension demandée par un porteur reste chez son produit.
3. RT-32 : le porteur cherche où agir à chaque page servie.
4. RA-2 : le générateur existe et sa recette est verte ; il reste à le porter au skill.

## La règle qui aurait évité le retour (TF-0779 — 02/09/2026)

- RA-1 : aucune règle ne couvre une énumération de sigles dans FS2 ; la fixture proposée la crée.
- RA-2 : aucune règle ne demande à un skill de déclarer une sortie de partage.
- RT-32 : S87 (TF-1973, TF-2016), bornée aux fichiers sous `output/`.
- RT-33 : aucune règle ne fait d'une demande d'extension d'un skill un retour au moment même.
