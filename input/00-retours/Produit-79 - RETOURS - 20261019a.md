# Retours forges — Produit-79 — 20261019a

- **Contexte** : incident — l'exploitant refuse le 19/10/2026 une restitution qui lui demande de relire la semaine 2 des publications sans lui donner le contenu ni son lien, puis demande à la factory une étude d'opportunité
- **Références ledger** : `forge\ledger.jsonl` seq 621, 622 (entrées `type: retour`)
- **Remise au pilot** : copie de ce fichier et de son sidecar dans le sas `<pilot>\input\00-retours\_arrivee\`.
- **Statut** : remis le 19/10/2026

---

## pilot (`digit-ai-factory`)

Une restitution peut demander un avis sur un contenu absent : aucun contrôle ne vérifie que ce que l'humain doit relire est sous ses yeux ou à un clic. Et rien ne relit la restitution comme son lecteur avant de l'afficher.

| id | Gravité | Portée | Retour (fait observé, avec preuve : fichier, message, mesure) | Proposition esquissée |
|---|---|---|---|---|
| RP-22 — avis demandé sans le contenu | majeur | générique | 19/10/2026, restitutions de 21:51 et 21:57 : action A-11 « relire la semaine 2 et répondre « ok semaine 2 » », colonne Comment « guide de mon message de 21:45 ». Ni les textes, ni les photos, ni un lien vers eux. Les deux restitutions avaient passé `node forge/hooks/factory.mjs restitution --prejuger` (affichable). Réponse de l'exploitant : « tu demandes un avis sur un contenu que tu ne fournis même pas. Si un avis est demandé sur un contenu, le lien de celui-ci doit être affiché. » (ledger, entrée 621). | Règle qui aurait évité le retour : aucune. **RP-22** : clé proposée `avis-demande-sans-le-contenu`, famille `restitution-forme`, libellé « Une action ou une décision demande à l'humain un avis, une relecture ou une validation sur un contenu que la restitution ne porte pas et dont elle ne donne pas le lien ». Proposition : une règle de `oracle-synthese` refuse une action ou une option dont le verbe demande un avis (relire, valider, vérifier, donner son accord sur) sans chemin de fichier, adresse ou bloc cité dans la même ligne ; le renvoi « mon message de HH:MM » n'en tient pas lieu. |
| RP-23 — étude d'opportunité : un relecteur de bon sens avant l'affichage | majeur | générique | Demande de l'exploitant du 19/10/2026, mot pour mot : « Est-ce que cette demande de bon sens pourrait être anticipée par un agent qui fait preuve de bon sens avant d'afficher le prompt de sortie ? Demander à la Factory d'en faire une étude d'opportunité. » Le défaut de RP-22 a passé `oracle-synthese`, qui juge la forme du message et non son usage (ledger, entrée 622). | Règle qui aurait évité le retour : aucune ; classe existante `lecture-tiers-non-jugee`. Étude demandée : un agent neuf, sans le contexte de la session, lit la restitution comme l'humain avant l'affichage et répond à des questions d'usage : chaque demande peut-elle être tenue avec ce seul message ; chaque contenu à juger est-il là ou à un clic ; chaque renvoi s'ouvre-t-il. L'étude chiffre son coût par tour, ses faux positifs, et dit s'il complète ou remplace la relecture d'intention en essai (TF-1865). |

## Rattachement

Registre interrogé le 19/10/2026 : `node -e` sur `todo\TODO.jsonl` du pilot, filtre des 5 049 entrées dont le titre ou le contenu répond à `/(sans (le |son )?lien|message pr[ée]c[ée]dent|relire .{0,40}(contenu|publication)|avis sur un contenu|bon sens|lecteur sans contexte|relecteur aveugle|relecture d.intention|pr[ée]-?affichage|avant d.afficher)/i`, sans borne → 13 ligne(s) trouvée(s).

Items recoupés :

- TF-1603 (candidat, « une demande de relance à une équipe tierce renvoyait à un message précédent par son heure au lieu de redonner les gestes exacts ») : RP-22 en est une récidive, appliquée à un contenu à relire ;
- TF-1865 (candidat, relecture d'intention par un tiers) : RP-23 en étend l'objet de l'intention à l'usage du message ;
- TF-1831 (candidat, relecteur aveugle du mode boucle L99) : même principe de juge neuf, sur un autre livrable ;
- TF-1872 (candidat, numéros de décision posés deux fois le même jour) : récidive vue dans ce produit le 19/10, D-100 prise par deux sessions puis par une troisième (ledger, entrées 551, 554 et 559), sans retour neuf.

Les 9 autres répondent au filtre par « sans lien » ou « message précédent » dans un autre sens.

## Remarques restées au produit

Ce chapitre dit ce que le produit a corrigé chez lui, et pourquoi cela remonte ou non.

| Remarque (chez le produit) | Corrigée comment | Généralisable ? | Verdict |
|---|---|---|---|
| Relecture de la semaine 2 demandée sans le contenu | fiche `output\06-rapports\Produit-79 - Fiche - Publications de la semaine 2 à relire - 20261019a.md`, textes, heures et 11 photos, liée depuis la restitution | oui | remonté en RP-22 |
| `forge\ledger.py question_humain` horodate à la seconde et crée de faux reculs d'horodatage | consigné au ledger, entrée 612 | non | outil du produit |

## Retours sur les documents produits

Aucun document produit depuis un gabarit sur ce lot : la fiche de relecture de la semaine 2 est une page de travail, écrite sans famille du catalogue.

## Documents mûrs

Un document mûr, mesuré par le contrôle du lot : « Dashboard - Acquisition et réservations », 5 versions datées. Verdict : reste au produit, parce qu'il instancie la famille proposée en RP-15 (lot 20261017c), qui n'existe pas encore au catalogue.

## Garde-fou de plateforme relevé

Aucun garde-fou de plateforme relevé sur ce lot.

## Confirmations positives

- `oracle-conformite-projet` (R-42) a classé « rectifié » les 8 numéros en double nés de la fusion de deux postes, sur la seule foi d'une entrée de rectification : la fusion n'a pas eu à renuméroter un registre cité partout.
