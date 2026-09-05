# Patrons éprouvés — mécanismes payés une fois, réutilisables tels quels

Référentiel du pilot (loi transverse n° 4 : une donnée volatile est une donnée — daté, sourcé,
éditable). **Version 1.1.0, 05/09/2026** (P-2, la 404 d'office — TF-0802) ; précédente 1.0.0, 02/09/2026. Un patron n'entre ici que **remonté par un produit avec
sa preuve d'exécution** (jeu d'essai joué, compte de cas, référence de ledger) ; une bonne idée
sans preuve reste une candidature au registre TODO-FORGE. Chaque patron dit ce qu'il **exclut**,
sans quoi il se réapplique hors de son domaine. Contrôle de forme : aucun — ce référentiel est
consommé par des humains et des agents à la conception ; la règle qui le cite (**R-54**,
`REGLES-PROJET.md` § AH) est, elle, une règle de conduite.

## P-1 — Une consigne en heure LOCALE ne se traduit jamais en une heure UTC unique

**Remonté par** Produit-02, lot `Produit-02 - RETOURS - 20260901a` (ledger produit seq 64 —
correction, seq 65 — retour) ; registre **TF-0740**, décidé le 02/09/2026.

**Le fait.** L'exploitant demande un relevé « tous les lundis matins à 6 h ». L'agent règle un
cron UTC unique et **déclare l'écart** été/hiver (6 h l'hiver, 5 h l'été) avec une justification
chiffrée présentée comme dissuasive (« exigerait deux crons et un test d'heure locale »). Le produit
portait DÉJÀ la mécanique de la solution (battement quotidien + script de décision, construits la
veille). Une question d'une ligne de l'exploitant a suffi ; la solution complète a coûté une
demi-heure, **douze cas de test compris, 26/26 en local et en CI**.

**Le patron.**

1. **Deux battements UTC** encadrent l'heure locale visée (pour 6 h Europe/Paris : 04:00 Z et
   05:00 Z) ; l'UTC est un détail d'implémentation qui **ne remonte pas dans le contrat**.
2. Un **filtre** calcule l'heure locale à l'exécution ; **seul le battement qui tombe à l'heure
   visée passe**, l'autre sort sans rien faire.
3. La **règle européenne** des changements d'heure est **codée en dur** (dernier dimanche de mars
   à 01:00 Z, dernier dimanche d'octobre à 01:00 Z — fixe depuis 1996), dans une fonction unique et
   nommée : une base de fuseaux absente du runner ferait juger l'environnement, pas la règle. Le
   jour où la règle change, il y a UN endroit à changer.
4. Un **battement retardé** (planificateur en retard de quelques minutes) passe quand même : le
   filtre compare l'heure locale à une fenêtre, pas à une minute.
5. L'**idempotence** (série en ajout seul, clé = jour) absorbe le doublon si, un jour de bascule,
   les deux battements passent.
6. Un **déclenchement manuel** contourne le filtre — l'exploitant peut toujours forcer un relevé.

**Jeu d'essai livré avec le patron** : 12 cas, dont les **4 instants de bascule à la minute
près** (avant/après chaque changement d'heure), un battement retardé, un doublon absorbé, un
déclenchement manuel hors filtre.

**Ce qu'il exclut.** Un fuseau hors Union européenne (la règle codée en dur est européenne) ;
une cadence infra-horaire ; un planificateur qui garantit déjà l'heure locale (alors il n'y a
rien à filtrer — et c'est à vérifier, pas à supposer).

## P-2 — La 404 est la page que personne ne conçoit : elle se livre d'office, par langue, du même gabarit que les autres

**Remonté par** Produit-02, lot `Produit-02 - RETOURS - 20260901b` (constat de l'exploitant du
01/09/2026, réalisation de référence livrée le jour même sur ce produit) ; registre **TF-0802**,
décidé le 03/09/2026 (D-5 a).

**Le fait.** Le 404 nu du serveur de fichiers (« The requested path could not be found », page
blanche, sans menu ni langue) a été servi sur un site multilingue en production du 25/08 au 01/09,
vu par personne. **Mécanisme généralisable** : la 404 est la page que PERSONNE ne conçoit parce que
personne ne la visite volontairement — aucun gabarit ne la génère, aucun oracle ne la juge, aucune
revue ne la voit. C'est le profil type du standard d'office (loi transverse n° 3) : l'invariant
qu'aucune demande de fonctionnalité ne fera émerger.

**Le patron.** Cinq exigences, toutes mesurables :

1. **Une 404 par langue, du MÊME gabarit que les autres pages** — menu complet, charte, consentement,
   liens de secours (accueil, plan du site, contact). Une 404 « spéciale » vieillit seule.
2. **Statut 404 CONSERVÉ** : une page d'erreur rendue en 200 est un soft-404 indexable.
3. **`noindex` + exclusion du sitemap**, l'exclusion **DÉCLARÉE** dans l'oracle SEO du produit
   (une page absente du sitemap sans déclaration passe pour un oubli).
4. **La langue choisie au préfixe du chemin** (`/fr/inconnu` → 404 en français ; sans préfixe →
   langue par défaut).
5. **Un contrôle exécutable qui joue les cas** : adresse inconnue → 404 avec menu ; préfixe respecté ;
   ressource non-HTML inconnue (image, script) → 404 nu, jamais une page HTML.

**Réalisation de référence** (Produit-02, 01/09) : 14 pages générées (7 langues × 404 + page de
retour de réservation, même mécanique hors index) ; **enveloppe** `writeHead/write/end` autour du
serveur de fichiers existant plutôt qu'une réimplémentation — deux implémentations font deux
vérités (leçon du lot 20260831b) ; 5 contrôles d'oracle.

**Piège mesuré et documenté.** Envelopper `writeHead` sans envelopper `write()` produit une
réponse PENDUE (code 000 côté client) : le corps nu du serveur part avant les en-têtes différés.
Remède d'une ligne : avaler les écritures du corps d'origine quand la réponse est substituée.

**Ce qu'il exclut.** Une application sans surface web (rien à servir) ; une application derrière
un routeur qui possède déjà sa page d'erreur par langue (alors c'est LUI qu'on juge, pas le patron) ;
les réponses d'API (JSON) : une API répond 404 en JSON, jamais en page. **Non éprouvé ailleurs** :
le patron a été joué sur ce seul produit ; le standard dit le contrat, pas l'implémentation.

**Où il se juge.** À la MEP, contrôle **M-9** (`ETAPE-MEP.md`), si et seulement si le produit a une
surface web ; en conception, la 404 entre dans la surface implicite proposée d'office
(`enumere-la-surface`, forge-conception — candidature à porter chez elle).

## Comment un patron entre ici

Une ligne au registre TODO-FORGE avec la preuve d'exécution, une décision humaine, puis une
section de ce fichier : **fait**, **patron** numéroté, **jeu d'essai**, **exclusions**. Sans
exclusions écrites, le patron n'entre pas — c'est la moitié qui évite la réapplication aveugle.
