# Patrons éprouvés — mécanismes payés une fois, réutilisables tels quels

Référentiel du pilot (loi transverse n° 4 : une donnée volatile est une donnée — daté, sourcé,
éditable). **Version 1.0.0, 02/09/2026.** Un patron n'entre ici que **remonté par un produit avec
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

## Comment un patron entre ici

Une ligne au registre TODO-FORGE avec la preuve d'exécution, une décision humaine, puis une
section de ce fichier : **fait**, **patron** numéroté, **jeu d'essai**, **exclusions**. Sans
exclusions écrites, le patron n'entre pas — c'est la moitié qui évite la réapplication aveugle.
